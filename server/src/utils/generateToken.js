const jwt = require('jsonwebtoken')

function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET. Please set it in your env file.')
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = generateToken

