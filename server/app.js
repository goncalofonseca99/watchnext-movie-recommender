import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { recommendRouter } from './routes/recommend.js';

const app = express();

// Allow all origins — the API key lives server-side and rate limiting is the real protection
app.use(cors({ methods: ['POST', 'OPTIONS'] }));

// Simple in-memory rate limiter: max 10 requests per IP per 15 minutes
const requestCounts = new Map();
function rateLimiter(req, res, next) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 10;
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }
  if (entry.count >= max) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  entry.count++;
  next();
}

app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimiter, recommendRouter);

export default app;
