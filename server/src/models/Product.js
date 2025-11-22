const { Schema, model } = require('mongoose')

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    category: { type: String, required: true },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = model('Product', productSchema)

