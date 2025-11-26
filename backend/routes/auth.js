import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RiderProfile from '../models/RiderProfile.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, phone, password, name, userType } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    if (!password || !name) {
      return res.status(400).json({ error: 'Password and name are required' });
    }

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
      name,
      userType: userType || 'USER',
    });

    if (userType === 'RIDER') {
      await RiderProfile.create({
        userId: user._id,
        status: 'OFFLINE',
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), userType: user.userType },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        name: user.name,
        profilePicture: user.profilePicture,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    const user = await User.findOne({
      $or: [
        email ? { email } : {},
        phone ? { phone } : {},
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), userType: user.userType },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        name: user.name,
        profilePicture: user.profilePicture,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

