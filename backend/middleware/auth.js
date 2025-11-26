import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token: missing user ID' });
    }

    req.userId = decoded.userId;
    req.userType = decoded.userType;
    console.log('Authenticated user:', req.userId, 'type:', req.userType);
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.userType !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

