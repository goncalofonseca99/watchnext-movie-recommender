import 'dotenv/config';
import express from 'express';
import { recommendRouter } from './routes/recommend.js';

const app = express();
app.use(express.json());
app.use('/api', recommendRouter);

export default app;
