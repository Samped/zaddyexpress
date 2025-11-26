import express from 'express';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!', timestamp: new Date().toISOString() });
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email phone name userType profilePicture createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        name: user.name,
        profilePicture: user.profilePicture,
        userType: user.userType,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

router.get('/orders', authenticate, async (req, res) => {
  try {
    console.log('=== FETCHING ORDERS ===');
    console.log('Request userId from JWT:', req.userId);
    console.log('Request userId type:', typeof req.userId);
    
    let userId;
    try {
      userId = new mongoose.Types.ObjectId(req.userId);
      console.log('Converted to ObjectId:', userId.toString());
    } catch (error) {
      console.error('Invalid userId format:', req.userId, error);
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const allOrdersSample = await Order.find({}).limit(10).select('userId');
    console.log(`\nTotal orders in database: ${await Order.countDocuments({})}`);
    console.log('Sample of ALL orders in DB (first 10):');
    allOrdersSample.forEach((order, idx) => {
      const orderUserIdStr = order.userId?.toString();
      const matches = orderUserIdStr === req.userId.toString();
      console.log(`  Order ${idx + 1}: userId = ${orderUserIdStr}, type = ${order.userId?.constructor?.name}, matches = ${matches}`);
    });
    
    console.log('\n[Query] Fetching all orders and filtering by userId...');
    const allOrders = await Order.find({})
      .populate('riderId', 'name phone profilePicture')
      .sort({ createdAt: -1 });
    
    console.log(`Total orders in database: ${allOrders.length}`);
    
    const reqUserIdStr = String(req.userId);
    const reqUserIdObjectId = userId.toString();
    
    console.log(`Looking for userId: "${reqUserIdStr}" or "${reqUserIdObjectId}"`);
    console.log('Checking each order...');
    
    const orders = allOrders.filter(order => {
      if (!order.userId) {
        console.log(`  ✗ Order ${order._id}: No userId`);
        return false;
      }
      
      const orderUserIdStr = String(order.userId);
      const orderUserIdObjectId = order.userId instanceof mongoose.Types.ObjectId 
        ? order.userId.toString() 
        : String(order.userId);
      
      const match = orderUserIdStr === reqUserIdStr || 
                   orderUserIdObjectId === reqUserIdObjectId ||
                   orderUserIdStr === reqUserIdObjectId ||
                   orderUserIdObjectId === reqUserIdStr;
      
      if (match) {
        console.log(`  ✓ MATCH: Order ${order._id} - userId: ${orderUserIdStr}`);
      } else {
        console.log(`  ✗ No match: Order ${order._id} - userId: ${orderUserIdStr}`);
      }
      
      return match;
    });
    
    console.log(`\n=== RESULT: Found ${orders.length} matching orders out of ${allOrders.length} total ===`);

    console.log(`\nFinal result: ${orders.length} orders found`);
    if (orders.length > 0) {
      console.log('Sample order:', {
        id: orders[0]._id.toString(),
        userId: orders[0].userId?.toString(),
        status: orders[0].status
      });
    }

    const formattedOrders = orders.map(order => ({
      _id: order._id.toString(),
      id: order._id.toString(),
      pickupAddress: order.pickupAddress,
      dropoffAddress: order.dropoffAddress,
      status: order.status,
      basePrice: order.basePrice,
      bidPrice: order.bidPrice,
      finalPrice: order.finalPrice,
      createdAt: order.createdAt,
      riderId: order.riderId ? {
        _id: order.riderId._id ? order.riderId._id.toString() : order.riderId.toString(),
        name: order.riderId.name,
        phone: order.riderId.phone,
        profilePicture: order.riderId.profilePicture,
      } : null,
    }));

    console.log(`\nSending response with ${formattedOrders.length} orders`);
    console.log('Response structure:', JSON.stringify({ orders: formattedOrders }, null, 2).substring(0, 500));

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;

