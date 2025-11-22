const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// CORS configuration - allow multiple origins including Vercel
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['*']

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      
      // If CLIENT_URL is '*', allow all origins
      if (allowedOrigins.includes('*')) {
        return callback(null, true)
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      
      // Allow Vercel preview deployments (they have dynamic URLs)
      if (origin.includes('.vercel.app')) {
        return callback(null, true)
      }
      
      // Allow localhost for development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true)
      }
      
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ecommerce API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
    },
  })
})

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API healthy' })
})

// API routes with /api prefix
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Route aliases without /api prefix (for frontend compatibility)
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

module.exports = app

