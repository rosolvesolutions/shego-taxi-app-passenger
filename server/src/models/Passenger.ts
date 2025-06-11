import mongoose from 'mongoose'

const passengerSchema = new mongoose.Schema({ 
  phoneNumber: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  pfp: String,
  createdAt: Date,
  updatedAt: Date,
  rating: Number,
})

const Passenger = mongoose.model('Passenger', passengerSchema)

export default Passenger
