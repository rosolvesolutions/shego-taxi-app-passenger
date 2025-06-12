// server/src/config/db.ts
import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`)

    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}

export default connectDB