const { validationResult } = require('express-validator')
const Product = require('../models/Product')
const Order = require('../models/Order')
const asyncHandler = require('../utils/asyncHandler')

exports.createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  const { items, address, paymentReference } = req.body
  const productIds = items.map((item) => item.productId)

  const products = await Product.find({ _id: { $in: productIds } })

  if (products.length !== productIds.length) {
    return res.status(400).json({ success: false, message: 'One or more products are invalid' })
  }

  const orderItems = []
  let total = 0

  for (const incoming of items) {
    const product = products.find((p) => p._id.toString() === incoming.productId)
    if (!product) continue

    if (product.stock < incoming.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` })
    }

    product.stock -= incoming.quantity
    await product.save()

    const lineTotal = product.price * incoming.quantity
    total += lineTotal

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: incoming.quantity,
    })
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total,
    address,
    paymentReference,
  })

  res.status(201).json({ success: true, data: order })
})

exports.getOrders = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user._id }
  const orders = await Order.find(query).sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
})

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
  res.json({ success: true, data: order })
})

exports.updateStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  const { status } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  order.status = status
  await order.save()
  res.json({ success: true, data: order })
})

