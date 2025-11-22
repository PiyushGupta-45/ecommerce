export type ProductCategory = 'Electronics' | 'Fashion' | 'Home' | 'Beauty' | 'Sports' | string

export interface Product {
  _id: string
  name: string
  description: string
  image: string
  price: number
  stock: number
  rating: number
  category: ProductCategory
  tags: string[]
  isFeatured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Address {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentDetails {
  cardholder: string
  cardNumber: string
  expiry: string
  cvv: string
}

export type OrderStatus = 'processing' | 'packed' | 'shipped' | 'out-for-delivery' | 'delivered'

export interface OrderItem {
  product: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface Order {
  _id: string
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt: string
  status: OrderStatus
  address: Address
  paymentReference: string
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export interface AuthResponse {
  token: string
  user: User
}

