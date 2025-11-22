const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const app = require('./app')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

startServer()

