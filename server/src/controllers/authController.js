const { validationResult } = require('express-validator')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('../utils/asyncHandler')

exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    })
  }

  const { name, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' })
  }

  const user = await User.create({ name, email, password })
  
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables')
    return res.status(500).json({ success: false, message: 'Server configuration error' })
  }
  
  const token = generateToken(user._id)

  res.status(201).json({
    success: true,
    data: {
      token,
      user,
    },
  })
})

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    })
  }

  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables')
    return res.status(500).json({ success: false, message: 'Server configuration error' })
  }

  const token = generateToken(user._id)
  res.json({ success: true, data: { token, user } })
})

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user })
})

