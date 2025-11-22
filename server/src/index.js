const dotenv = require('dotenv')
const connectDB = require('./config/db')
const app = require('./app')

// Load .env file only in development (Render provides env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  const path = require('path')
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
}

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API running on http://0.0.0.0:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

startServer()

