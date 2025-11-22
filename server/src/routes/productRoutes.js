const express = require('express')
const { body } = require('express-validator')
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const { protect, adminOnly } = require('../middleware/auth')

const router = express.Router()

router.get('/', listProducts)
router.get('/:id', getProduct)

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('image').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
    body('category').notEmpty(),
  ],
  createProduct,
)

router.patch('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

module.exports = router

