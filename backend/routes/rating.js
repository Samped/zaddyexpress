import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Rating from '../models/Rating.js';
import RiderProfile from '../models/RiderProfile.js';

const router = express.Router();

router.post('/create', authenticate, async (req, res) => {
  try {
    const { orderId, riderId, rating, comment } = req.body;

    if (!orderId || !riderId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating data' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const userIdStr = order.userId.toString();
    if (userIdStr !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.paymentStatus !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment must be completed before rating' });
    }

    const ratingRecord = await Rating.create({
      orderId,
      userId: req.userId,
      riderId,
      rating,
      comment: comment || null,
    });

    const ratings = await Rating.find({ riderId });
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    await RiderProfile.findOneAndUpdate(
      { userId: riderId },
      { rating: averageRating }
    );

    res.json({ rating: ratingRecord, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rating creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
