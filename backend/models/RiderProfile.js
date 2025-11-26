import mongoose from 'mongoose';

const riderProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE'],
    default: 'OFFLINE',
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('RiderProfile', riderProfileSchema);


