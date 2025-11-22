const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables')
      return res.status(500).json({ success: false, message: 'Server configuration error' })
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' })
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' })
    }
    console.error('Auth middleware error:', error.message)
    return res.status(401).json({ success: false, message: 'Not authorized' })
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}

module.exports = { protect, adminOnly }

