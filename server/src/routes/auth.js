import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { JWT_SECRET, JWT_EXPIRY } from '../config/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

// POST /register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    const existing = await User.findByEmail(email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create(email.toLowerCase(), passwordHash, displayName.trim());
    const token = signToken(user);

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PUT /me
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { displayName, roastParagraphs } = req.body;

    if (displayName !== undefined && (typeof displayName !== 'string' || displayName.trim().length === 0)) {
      return res.status(400).json({ error: 'Display name cannot be empty' });
    }
    if (roastParagraphs !== undefined && !Array.isArray(roastParagraphs)) {
      return res.status(400).json({ error: 'roastParagraphs must be an array' });
    }

    const user = await User.updateProfile(req.user.userId, {
      displayName: displayName?.trim(),
      roastParagraphs,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
