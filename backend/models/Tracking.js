import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Tracking', trackingSchema);


