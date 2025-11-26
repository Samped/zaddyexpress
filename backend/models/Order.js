import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  dropoffAddress: {
    type: String,
    required: true,
  },
  pickupLat: {
    type: Number,
    required: true,
  },
  pickupLng: {
    type: Number,
    required: true,
  },
  dropoffLat: {
    type: Number,
    required: true,
  },
  dropoffLng: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  bidPrice: {
    type: Number,
    required: true,
  },
  finalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  paymentMethod: {
    type: String,
    enum: ['BANK_TRANSFER', 'CARD'],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Order', orderSchema);


