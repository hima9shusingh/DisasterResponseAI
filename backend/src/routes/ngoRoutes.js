import express from 'express';
import {
  getNgoProfile,
  updateNgoProfile,
  getNgoVolunteers,
  assignVolunteerToCamp,
  removeVolunteerFromCamp,
  getNgoCamps,
  getNgoSupplyRequests,
  getNgoDashboardStats
} from '../controllers/ngoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/me', protect, authorizeRoles('ngo'), getNgoProfile);
router.put('/me', protect, authorizeRoles('ngo'), updateNgoProfile);
router.get('/me/stats', protect, authorizeRoles('ngo'), getNgoDashboardStats);
router.get('/volunteers', protect, authorizeRoles('ngo', 'government', 'admin'), getNgoVolunteers);
router.get('/camps', protect, authorizeRoles('ngo'), getNgoCamps);
router.get('/supply-requests', protect, authorizeRoles('ngo'), getNgoSupplyRequests);
router.patch('/camps/:campId/assign-volunteer', protect, authorizeRoles('ngo', 'government', 'admin'), assignVolunteerToCamp);
router.patch('/camps/:campId/remove-volunteer', protect, authorizeRoles('ngo', 'government', 'admin'), removeVolunteerFromCamp);

export default router;
