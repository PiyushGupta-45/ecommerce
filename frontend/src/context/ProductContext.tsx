import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../types'
import api from '../lib/api'

interface ProductInput {
  name: string
  description: string
  image: string
  price: number
  stock: number
  rating?: number
  category: string
  tags?: string[]
  isFeatured?: boolean
}

interface ProductContextValue {
  products: Product[]
  loading: boolean
  fetchProducts: () => Promise<void>
  createProduct: (payload: ProductInput) => Promise<void>
  updateProduct: (id: string, payload: Partial<ProductInput>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products')
      setProducts(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const createProduct = async (payload: ProductInput) => {
    const { data } = await api.post('/products', payload)
    setProducts((prev) => [data.data, ...prev])
  }

  const updateProduct = async (id: string, payload: Partial<ProductInput>) => {
    const { data } = await api.patch(`/products/${id}`, payload)
    setProducts((prev) => prev.map((product) => (product._id === id ? data.data : product)))
  }

  const deleteProduct = async (id: string) => {
    await api.delete(`/products/${id}`)
    setProducts((prev) => prev.filter((product) => product._id !== id))
  }

  const value = useMemo(
    () => ({
      products,
      loading,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, loading, fetchProducts],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return ctx
}

