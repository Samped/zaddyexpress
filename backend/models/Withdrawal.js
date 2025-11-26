import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RiderProfile',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  bankAccount: String,
}, {
  timestamps: true,
});

export default mongoose.model('Withdrawal', withdrawalSchema);


