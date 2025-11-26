import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['USER', 'RIDER', 'ADMIN'],
    default: 'USER',
  },
  name: String,
  profilePicture: {
    type: String,
    default: null,
  },
  kycVerified: {
    type: Boolean,
    default: false,
  },
  nin: String,
  faceRecognitionData: String,
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);

