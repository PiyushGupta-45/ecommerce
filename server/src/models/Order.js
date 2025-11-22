const { Schema, model } = require('mongoose')

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['processing', 'packed', 'shipped', 'out-for-delivery', 'delivered'],
      default: 'processing',
    },
    paymentReference: { type: String, required: true },
  },
  { timestamps: true },
)

module.exports = model('Order', orderSchema)

