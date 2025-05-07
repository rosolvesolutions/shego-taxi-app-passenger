import express from 'express'
import Passenger from '../models/Passenger'

const router = express.Router()

router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const {
      phoneNumber,
      firstName,
      lastName,
      email,
    } = req.body

    const newPassenger = new Passenger({
      phoneNumber,
      firstName,
      lastName,
      email,
      pfp: "None",
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 5, // or whatever default you want
    })

    await newPassenger.save()

    res.status(201).json({ message: 'Passenger registered successfully' })
  } catch (err) {
    console.error('❌ Registration Error:', err)
    res.status(500).json({ error: 'Failed to register passenger' })
  }
})

export default router
