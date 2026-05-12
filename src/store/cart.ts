'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type CartItem = {
  slug: string
  packSize: number
  titleBg: string
  titleEn: string
  quantity: number
  /** EUR cents per pack. Snapshot from ProductPlan at the time of add-to-cart. */
  unitPriceCents: number
  currency: string
}

const cartStorageAtom = atomWithStorage<CartItem[]>('tepe_bite_cart', [], {
  getItem(key, initialValue) {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as CartItem[]) : initialValue
    } catch {
      return initialValue
    }
  },
  setItem(key, value) {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
})

/** Add item or increment quantity if slug already in cart. */
export const addToCartAtom = atom(null, (_get, set, item: CartItem) => {
  set(cartStorageAtom, (prev) => {
    const existing = prev.find((i) => i.slug === item.slug)
    if (existing) {
      return prev.map((i) =>
        i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i,
      )
    }
    return [...prev, item]
  })
})

/** Remove item from cart by slug. */
export const removeFromCartAtom = atom(null, (_get, set, slug: string) => {
  set(cartStorageAtom, (prev) => prev.filter((i) => i.slug !== slug))
})

/** Set an item's quantity. Removes item if quantity <= 0. */
export const updateQuantityAtom = atom(
  null,
  (_get, set, payload: { slug: string; quantity: number }) => {
    set(cartStorageAtom, (prev) => {
      if (payload.quantity <= 0) return prev.filter((i) => i.slug !== payload.slug)
      return prev.map((i) => (i.slug === payload.slug ? { ...i, quantity: payload.quantity } : i))
    })
  },
)

/** Clear all items from cart. */
export const clearCartAtom = atom(null, (_get, set) => {
  set(cartStorageAtom, [])
})

/** Total number of packs in cart. */
export const cartItemCountAtom = atom((get) =>
  get(cartStorageAtom).reduce((sum, i) => sum + i.quantity, 0),
)

/**
 * Subtotal in EUR cents based on unitPriceCents snapshots.
 * Returns 0 if any item has unitPriceCents === 0 (price unavailable).
 */
export const cartSubtotalCentsAtom = atom((get) =>
  get(cartStorageAtom).reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
)

// ─── Convenience hooks ───────────────────────────────────────────────────────

export function useCart() {
  return useAtomValue(cartStorageAtom)
}

export function useCartItemCount() {
  return useAtomValue(cartItemCountAtom)
}

export function useCartSubtotalCents() {
  return useAtomValue(cartSubtotalCentsAtom)
}

export function useAddToCart() {
  return useSetAtom(addToCartAtom)
}

export function useRemoveFromCart() {
  return useSetAtom(removeFromCartAtom)
}

export function useUpdateQuantity() {
  return useSetAtom(updateQuantityAtom)
}

export function useClearCart() {
  return useSetAtom(clearCartAtom)
}

export function useCartAtom() {
  return useAtom(cartStorageAtom)
}

// ─── Cart toast state ─────────────────────────────────────────────────────────

export type CartToastState = {
  visible: boolean
  titleBg: string
  titleEn: string
}

export const cartToastAtom = atom<CartToastState>({
  visible: false,
  titleBg: '',
  titleEn: '',
})

export function useCartToast() {
  return useAtom(cartToastAtom)
}

export function useShowCartToast() {
  const setToast = useSetAtom(cartToastAtom)
  return (titleBg: string, titleEn: string) => {
    setToast({ visible: true, titleBg, titleEn })
  }
}
