import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
