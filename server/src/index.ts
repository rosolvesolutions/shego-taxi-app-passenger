import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import connectDB from './config/db'
import passengerRoutes from './routes/passenger'
import visionRoutes from './routes/visionRoute'
import bookingRoutes from './routes/booking'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const app = express()
const PORT = process.env.EXPRESS_SERVER_PORT || 5001

app.use(cors({ origin: '*' })) // You can allow all origins or restrict to your Expo address
app.use(express.json()) // Enable JSON body parsing

connectDB() // Initialize MongoDB connection

// Test endpoint
app.get('/api/value', (req, res) => {
  res.json({ value: 'Express Server Status: WORKING!' })
})

// Driver registration routes
app.use('/api/passenger', passengerRoutes)

app.use('/api/vision', visionRoutes)

app.use('/api/booking', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running at ${process.env.EXPRESS_SERVER_IP}:${PORT}!`)
})