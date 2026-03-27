import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { recommendRouter } from './routes/recommend.js';

const app = express();

// Allow all origins — the API key lives server-side and rate limiting is the real protection
app.use(cors({ methods: ['POST', 'OPTIONS'] }));

// Rate limit: max 10 recommendation requests per IP per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

app.use(express.json({ limit: '10kb' }));
app.use('/api', apiLimiter, recommendRouter);

export default app;
