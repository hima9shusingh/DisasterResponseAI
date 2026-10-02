import express from 'express';
import {
  createSupplyRequest,
  getSupplyRequests,
  getSupplyRequestById,
  updateSupplyRequestStatus
} from '../controllers/supplyRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('government', 'ngo'), createSupplyRequest);
router.get('/', protect, authorizeRoles('government', 'admin', 'ngo'), getSupplyRequests);
router.get('/:id', protect, authorizeRoles('government', 'admin', 'ngo'), getSupplyRequestById);
router.patch('/:id/status', protect, authorizeRoles('government', 'admin', 'ngo'), updateSupplyRequestStatus);

export default router;
