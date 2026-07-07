/**
 * Edge-runtime-safe session verification for proxy.ts (Next 16's renamed
 * middleware). Uses Web Crypto instead of node:crypto so it can run at the edge.
 * Only checks signature + expiry — it does NOT touch the database (per Next's
 * guidance that proxy code should avoid shared modules/DB access).
 */

/** Decode base64url into a fresh ArrayBuffer (a valid BufferSource for Web Crypto). */
function base64urlToBuffer(b64url: string): ArrayBuffer {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const bin = atob(padded)
  const buffer = new ArrayBuffer(bin.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i)
  return buffer
}

/** Encode a string into a fresh ArrayBuffer. */
function stringToBuffer(str: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(str)
  const buffer = new ArrayBuffer(encoded.length)
  new Uint8Array(buffer).set(encoded)
  return buffer
}

export async function verifySessionTokenEdge(
  token: string,
  secret: string,
): Promise<{ sub: string } | null> {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sigB64] = parts

  const key = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64urlToBuffer(sigB64),
    stringToBuffer(payloadB64),
  )
  if (!valid) return null

  try {
    const json = new TextDecoder().decode(base64urlToBuffer(payloadB64))
    const payload = JSON.parse(json)
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    if (typeof payload.sub !== 'string' || !payload.sub) return null
    return { sub: payload.sub }
  } catch {
    return null
  }
}
