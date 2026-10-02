import express from 'express';
import {
  getVolunteerProfile,
  updateVolunteerProfile,
  updateVolunteerAvailability,
  getVolunteers,
  getVolunteerById,
  getVolunteerStats
} from '../controllers/volunteerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/me', protect, authorizeRoles('volunteer'), getVolunteerProfile);
router.put('/me', protect, authorizeRoles('volunteer'), updateVolunteerProfile);
router.patch('/me/availability', protect, authorizeRoles('volunteer'), updateVolunteerAvailability);
router.get('/me/stats', protect, authorizeRoles('volunteer'), getVolunteerStats);
router.get('/', protect, authorizeRoles('government', 'ngo', 'admin'), getVolunteers);
router.get('/:id', protect, authorizeRoles('government', 'ngo', 'admin', 'volunteer'), getVolunteerById);

export default router;
