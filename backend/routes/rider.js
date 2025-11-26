import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import RiderProfile from '../models/RiderProfile.js';
import Transaction from '../models/Transaction.js';
import Withdrawal from '../models/Withdrawal.js';

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    const profile = await RiderProfile.findOne({ userId: req.userId }).populate('userId', 'name email phone profilePicture');

    if (!profile) {
      return res.status(404).json({ error: 'Rider profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching rider profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/kyc', authenticate, async (req, res) => {
  try {
    const { nin, faceRecognitionData } = req.body;

    if (!nin || !faceRecognitionData) {
      return res.status(400).json({ error: 'NIN and face recognition data are required' });
    }

    await User.findByIdAndUpdate(req.userId, {
      nin,
      faceRecognitionData,
      kycVerified: true,
    });

    res.json({ message: 'KYC submitted successfully' });
  } catch (error) {
    console.error('KYC error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['ONLINE', 'OFFLINE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await RiderProfile.findOneAndUpdate(
      { userId: req.userId },
      { status }
    );

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ riderId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/withdraw', authenticate, async (req, res) => {
  try {
    const { amount, bankAccount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!bankAccount) {
      return res.status(400).json({ error: 'Bank account is required' });
    }

    const profile = await RiderProfile.findOne({ userId: req.userId });

    if (!profile || profile.availableBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const withdrawal = await Withdrawal.create({
      riderId: profile._id,
      amount,
      bankAccount,
      status: 'PENDING',
    });

    profile.availableBalance -= amount;
    await profile.save();

    res.json({ withdrawal, message: 'Withdrawal request submitted' });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

