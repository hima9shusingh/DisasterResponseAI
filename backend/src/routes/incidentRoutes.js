import express from 'express';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  getMyIncidents,
  updateIncidentStatus,
  updateIncident,
  deleteIncident,
  verifyIncident,
  uploadIncidentEvidence,
  getIncidentEvidence,
  deleteIncidentEvidence,
  createPublicIncident,
} from '../controllers/incidentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { upload } from '../services/uploadService.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const publicIncidentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many public reports, please try again later.' }
});

router.post('/public', publicIncidentLimiter, createPublicIncident);

router.post(
  '/',
  protect,
  authorizeRoles('citizen', 'government', 'admin'),
  createIncident
);

router.get(
  '/',
  protect,
  authorizeRoles('government', 'admin'),
  getIncidents
);

router.get(
  '/my',
  protect,
  authorizeRoles('citizen'),
  getMyIncidents
);

router.get(
  '/:id',
  protect,
  authorizeRoles('citizen', 'government', 'admin'),
  getIncidentById
);

router.put(
  '/:id',
  protect,
  authorizeRoles('government', 'admin'),
  updateIncident
);

router.patch(
  '/:id/verify',
  protect,
  authorizeRoles('government', 'admin'),
  verifyIncident
);

router.patch(
  '/:id/status',
  protect,
  authorizeRoles('government', 'admin'),
  updateIncidentStatus
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteIncident
);

router.post(
  '/:id/evidence',
  protect,
  authorizeRoles('citizen', 'government', 'admin'),
  upload.array('files', 7),
  uploadIncidentEvidence
);

router.get(
  '/:id/evidence',
  protect,
  authorizeRoles('citizen', 'volunteer', 'ngo', 'government', 'admin'),
  getIncidentEvidence
);

router.delete(
  '/:id/evidence/:evidenceId',
  protect,
  authorizeRoles('citizen', 'government', 'admin'),
  deleteIncidentEvidence
);

export default router;
