import express from 'express';
import {
  createAlert,
  getAlerts,
  getActiveAlerts,
  getAlertById,
  updateAlert,
  activateAlert,
  resolveAlert,
  deleteAlert
} from '../controllers/emergencyAlertController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveAlerts);

// Protected routes for authenticated users
router.use(protect);

router.get('/', getAlerts);
router.get('/:id', getAlertById);

// Restricted routes
router.use(authorizeRoles('government', 'admin'));

router.post('/', createAlert);
router.put('/:id', updateAlert);
router.patch('/:id/activate', activateAlert);
router.patch('/:id/resolve', resolveAlert);

router.delete('/:id', authorizeRoles('admin'), deleteAlert);

export default router;
