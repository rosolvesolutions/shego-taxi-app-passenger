import mongoose from 'mongoose';

const { Schema } = mongoose;

// GeoJSON Point schema for location fields
const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// Booking schema
const bookingSchema = new Schema(
  {
    passengerId: {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
    },
    pickupLocation: {
      type: pointSchema,
      required: true,
    },
    dropoffLocation: {
      type: pointSchema,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal'],
      required: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: Date,
    completedAt: Date,
    distanceKm: {
      type: Number,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Geospatial indexes for efficient querying
bookingSchema.index({ pickupLocation: '2dsphere' });
bookingSchema.index({ dropoffLocation: '2dsphere' });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
