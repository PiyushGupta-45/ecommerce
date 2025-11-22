import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Address, CartItem, Order, OrderStatus } from '../types'
import api from '../lib/api'
import { useAuth } from './AuthContext'

interface OrderContextValue {
  orders: Order[]
  loading: boolean
  fetchOrders: () => Promise<void>
  createOrder: (payload: {
    items: CartItem[]
    address: Address
    paymentReference: string
  }) => Promise<Order>
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/orders')
      setOrders(data.data)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder: OrderContextValue['createOrder'] = async ({ items, address, paymentReference }) => {
    const payload = {
      items: items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      address,
      paymentReference,
    }
    const { data } = await api.post('/orders', payload)
    setOrders((prev) => [data.data, ...prev])
    return data.data
  }

  const updateStatus: OrderContextValue['updateStatus'] = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status })
    setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status } : order)))
  }

  const value = useMemo<OrderContextValue>(
    () => ({
      orders,
      loading,
      fetchOrders,
      createOrder,
      updateStatus,
    }),
    [orders, loading, fetchOrders],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) {
    throw new Error('useOrders must be used within OrderProvider')
  }
  return ctx
}

