import express from 'express';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';
import RiderProfile from '../models/RiderProfile.js';
import { io } from '../server.js';

const router = express.Router();

router.post('/create', authenticate, async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, pickupLat, pickupLng, dropoffLat, dropoffLng, basePrice, bidPrice } = req.body;

    if (!pickupAddress || !dropoffAddress || !pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return res.status(400).json({ error: 'All location fields are required' });
    }

    if (!basePrice || !bidPrice || bidPrice < basePrice) {
      return res.status(400).json({ error: 'Invalid pricing' });
    }

    if (basePrice < 1000 || basePrice > 10000) {
      return res.status(400).json({ error: 'Base price must be between ₦1,000 and ₦6,000' });
    }

    if (bidPrice < 1000 || bidPrice > 10000) {
      return res.status(400).json({ error: 'Bid price must be between ₦1,000 and ₦6,000' });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    
    const order = await Order.create({
      userId: userId,
      pickupAddress,
      dropoffAddress,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      basePrice,
      bidPrice,
      status: 'PENDING',
    });
    
    console.log('Order created with userId:', userId.toString());

    io.emit('order-request', {
      id: order._id.toString(),
      userId: req.userId,
      pickupAddress,
      dropoffAddress,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      basePrice,
      bidPrice,
    });

    const formattedOrder = {
      _id: order._id.toString(),
      id: order._id.toString(),
      userId: order.userId.toString(),
      pickupAddress: order.pickupAddress,
      dropoffAddress: order.dropoffAddress,
      status: order.status,
      basePrice: order.basePrice,
      bidPrice: order.bidPrice,
      finalPrice: order.finalPrice,
      createdAt: order.createdAt,
    };

    res.json({ order: formattedOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(id)
      .populate('userId', 'name phone')
      .populate('riderId', 'name phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const userIdStr = req.userId.toString();
    const orderUserIdStr = order.userId._id ? order.userId._id.toString() : order.userId.toString();
    const orderRiderIdStr = order.riderId ? (order.riderId._id ? order.riderId._id.toString() : order.riderId.toString()) : null;

    if (orderUserIdStr !== userIdStr && orderRiderIdStr !== userIdStr) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/accept', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Order is no longer available' });
    }

    const riderProfile = await RiderProfile.findOne({ userId: req.userId });

    if (!riderProfile || riderProfile.status !== 'ONLINE') {
      return res.status(400).json({ error: 'Rider must be online to accept orders' });
    }

    order.riderId = req.userId;
    order.status = 'ACCEPTED';
    order.finalPrice = order.bidPrice;
    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Order acceptance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/ignore', authenticate, async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    console.log(`Order ${orderId} ignored by rider ${req.userId}. Reason: ${reason}`);

    res.json({ message: 'Order ignored' });
  } catch (error) {
    console.error('Order ignore error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/complete', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const riderIdStr = order.riderId ? order.riderId.toString() : null;
    if (riderIdStr !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    order.status = 'COMPLETED';
    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Order completion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

