const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI. Please set it in your env file.')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('✅ MongoDB connected')
}

module.exports = connectDB

