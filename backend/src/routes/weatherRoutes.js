import express from 'express';
import rateLimit from 'express-rate-limit';
import { getWeather } from '../controllers/weatherController.js';

const router = express.Router();

const weatherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { success: false, message: 'Too many weather requests, please try again later.' }
});

// Weather endpoints are publicly accessible but rate limited
router.get('/', weatherLimiter, getWeather);

export default router;
