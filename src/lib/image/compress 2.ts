/**
 * Client-side image downscaling for expense proofs. We store proofs on the
 * UploadThing free plan, so bills/quotes are reduced to the smallest usable
 * form: grayscale (black & white) and capped at 720×480 while preserving each
 * image's own aspect ratio (no assumed ratio). Exported as a low-quality JPEG.
 *
 * Browser-only (uses <canvas>/Image). Call before handing the File to UploadThing.
 */

const MAX_W = 720
const MAX_H = 480
const QUALITY = 0.5

/** Load a File into an HTMLImageElement via an object URL, cleaning it up after. */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Неуспешно зареждане на изображението.'))
    }
    img.src = url
  })
}

/**
 * Compress a raster image File to a grayscale, ≤720×480 JPEG File.
 * Throws for non-image input or on decode/encode failure.
 */
export async function compressToBW(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Файлът трябва да е изображение.')
  }

  const img = await loadImage(file)

  // Scale to fit within the box, keeping aspect ratio; never upscale.
  const scale = Math.min(MAX_W / img.width, MAX_H / img.height, 1)
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas не се поддържа.')

  // Grayscale flatten on white so any transparency doesn't turn black.
  ctx.filter = 'grayscale(100%)'
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY),
  )
  if (!blob) throw new Error('Неуспешно обработване на изображението.')

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'proof'
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
}
