import express from 'express';
import { createSOS, getSOSRequests, updateSOSStatus, getMySOS } from '../controllers/sosController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limit SOS creation: 5 requests per 10 minutes per IP
const sosLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5, 
  message: { success: false, message: 'Too many SOS requests. Please try again later.' }
});

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const softProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id || decoded.userId).select('-password');
    } catch (error) {
      // ignore invalid token for soft protect
    }
  }
  next();
};

router.post('/', sosLimiter, softProtect, createSOS);
router.get('/my', protect, authorizeRoles('citizen'), getMySOS);

router.get('/', protect, authorizeRoles('admin', 'government'), getSOSRequests);
router.patch('/:id/status', protect, authorizeRoles('admin', 'government'), updateSOSStatus);

export default router;
