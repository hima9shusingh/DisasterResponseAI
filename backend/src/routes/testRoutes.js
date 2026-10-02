import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Government test route
router.get('/government', protect, authorizeRoles('government', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Government route accessed successfully'
  });
});

// Admin test route
router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin route accessed successfully'
  });
});

// Volunteer test route
router.get('/volunteer', protect, authorizeRoles('volunteer'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Volunteer route accessed successfully'
  });
});

export default router;
