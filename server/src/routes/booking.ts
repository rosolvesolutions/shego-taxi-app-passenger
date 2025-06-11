// server/src/routes/booking.ts
import express, { Request, Response } from 'express';
import Booking from '../models/Booking';

const router = express.Router();

router.post('/request', async (req: Request, res: Response) => {
  try {
    const {
      passengerId,
      driverId = null,
      pickupLocation,
      dropoffLocation,
      fare,
      status = 'pending',
      paymentMethod = 'credit_card',
      requestedAt = new Date(),
      distanceKm,
      durationMinutes,
    } = req.body;

    const newBooking = new Booking({
      passengerId,
      driverId,
      pickupLocation,
      dropoffLocation,
      fare,
      status,
      paymentMethod,
      requestedAt,
      distanceKm,
      durationMinutes,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', bookingId: newBooking._id });
  } catch (err) {
    console.error('❌ Booking Error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
