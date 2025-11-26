import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Transaction from '../models/Transaction.js';
import RiderProfile from '../models/RiderProfile.js';

const router = express.Router();

router.post('/process', authenticate, async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const userIdStr = order.userId.toString();
    if (userIdStr !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Order must be completed before payment' });
    }

    const payment = await Payment.create({
      orderId,
      amount,
      method,
      status: 'COMPLETED',
      transactionId: `TXN-${Date.now()}`,
    });

    order.paymentStatus = 'COMPLETED';
    order.paymentMethod = method;
    await order.save();

    if (order.riderId) {
      const riderProfile = await RiderProfile.findOne({ userId: order.riderId });

      if (riderProfile) {
        await Transaction.create({
          riderId: order.riderId,
          paymentId: payment._id,
          amount,
          type: 'EARNINGS',
          status: 'COMPLETED',
        });

        riderProfile.totalEarnings += amount;
        riderProfile.availableBalance += amount;
        await riderProfile.save();
      }
    }

    res.json({ payment, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

