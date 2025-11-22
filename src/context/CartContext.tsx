import { createContext, useContext, useMemo } from 'react'
import type { CartItem, Product } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface CartContextValue {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('ecom-cart', [])

  const addItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.product._id === product._id)
      if (exists) {
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.product._id === productId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => setItems([])

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({ items, total, addItem, removeItem, updateQuantity, clearCart }),
    [items, total],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}

