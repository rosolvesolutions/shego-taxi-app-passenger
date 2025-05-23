import mongoose from 'mongoose'

<<<<<<< HEAD
const passengerSchema = new mongoose.Schema({ 
=======
const passengerSchema = new mongoose.Schema({
  _id: Number, 
>>>>>>> e5860c7 (Add all project files - needs restructuring)
  phoneNumber: String,
  firstName: String,
  lastName: String,
  email: String,
<<<<<<< HEAD
  password: String,
=======
>>>>>>> e5860c7 (Add all project files - needs restructuring)
  pfp: String,
  createdAt: Date,
  updatedAt: Date,
  rating: Number,
})

const Passenger = mongoose.model('Passenger', passengerSchema)

export default Passenger
