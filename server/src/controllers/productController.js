const { validationResult } = require('express-validator')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

exports.listProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query
  const filter = {}

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  if (category && category !== 'all') {
    filter.category = category
  }

  const products = await Product.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, data: products })
})

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({ success: true, data: product })
})

exports.createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  const product = await Product.create(req.body)
  res.status(201).json({ success: true, data: product })
})

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({ success: true, data: product })
})

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({ success: true, message: 'Product removed' })
})

