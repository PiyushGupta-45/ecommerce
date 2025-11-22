const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API healthy' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

module.exports = app

