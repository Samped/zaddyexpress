import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import RiderProfile from '../models/RiderProfile.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Rating from '../models/Rating.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: 'USER' });
    const totalRiders = await User.countDocuments({ userType: 'RIDER' });
    const activeRiders = await RiderProfile.countDocuments({ status: 'ONLINE' });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'COMPLETED' });

    const payments = await Payment.find({ status: 'COMPLETED' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);

    const newUsersThisMonth = await User.countDocuments({
      userType: 'USER',
      createdAt: { $gte: thisMonthStart },
    });

    const newRidersThisMonth = await User.countDocuments({
      userType: 'RIDER',
      createdAt: { $gte: thisMonthStart },
    });

    const activeUsersThisWeek = await User.countDocuments({
      userType: 'USER',
      createdAt: { $gte: thisWeekStart },
    });

    const ratings = await Rating.find({});
    const averageRiderRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.json({
      analytics: {
        totalUsers,
        totalRiders,
        activeRiders,
        totalOrders,
        completedOrders,
        totalRevenue,
        newUsersThisMonth,
        newRidersThisMonth,
        activeUsersThisWeek,
        averageRiderRating,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

