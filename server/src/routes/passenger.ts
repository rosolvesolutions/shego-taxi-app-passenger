<<<<<<< HEAD
// src/routes/passenger.ts

import express from 'express';
import bcrypt from 'bcrypt';
import Passenger from '../models/Passenger';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { phoneNumber, firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPassenger = new Passenger({
=======
import express from 'express'
import Passenger from '../models/Passenger'

const router = express.Router()

// Simple numeric ID counter (replace with a real counter in production)
let nextPassengerId = 1

router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const {
>>>>>>> e5860c7 (Add all project files - needs restructuring)
      phoneNumber,
      firstName,
      lastName,
      email,
<<<<<<< HEAD
      password: hashedPassword,
      pfp: 'None',
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 5,
    });

    await newPassenger.save();
    res.status(201).json({ message: 'Passenger registered successfully' });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ error: 'Failed to register passenger' });
  }
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Passenger.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ This is the only thing you export:
export default router;
=======
    } = req.body

    const newPassenger = new Passenger({
      _id: nextPassengerId++, // Numeric ID instead of ObjectId
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
>>>>>>> e5860c7 (Add all project files - needs restructuring)
