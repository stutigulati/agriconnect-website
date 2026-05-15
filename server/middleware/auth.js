import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agriconnect-dev-secret';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing auth token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Invalid user token' });
    req.user = user;
    req.userId = user._id;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Does NOT block — just populates req.userId if valid token is present
export function optionalAuth(req, _res, next) {
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
      req.userId = decoded.userId;
    }
  } catch { /* unauthenticated ok */ }
  next();
}
