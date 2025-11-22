const express = require('express')
const { body } = require('express-validator')
const { createOrder, getOrders, getOrderById, updateStatus } = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').notEmpty().withMessage('productId is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity must be at least 1'),
    body('address').notEmpty(),
    body('paymentReference').notEmpty(),
  ],
  createOrder,
)

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.patch('/:id/status', adminOnly, body('status').notEmpty(), updateStatus)

module.exports = router

