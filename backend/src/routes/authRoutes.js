import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for auth routes
  message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getCurrentUser);

// Protected test endpoint
router.get('/protected', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

export default router;
