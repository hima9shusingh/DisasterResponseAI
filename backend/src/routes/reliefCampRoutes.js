import express from 'express';
import {
  createCamp,
  getCamps,
  getCampById,
  updateCamp,
  updateCampOccupancy,
  updateCampInventory,
  deleteCamp
} from '../controllers/reliefCampController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('government', 'admin', 'ngo'), createCamp);
router.get('/', protect, authorizeRoles('citizen', 'government', 'volunteer', 'ngo', 'admin'), getCamps);
router.get('/:id', protect, authorizeRoles('citizen', 'government', 'volunteer', 'ngo', 'admin'), getCampById);
router.put('/:id', protect, authorizeRoles('government', 'admin', 'ngo'), updateCamp);
router.patch('/:id/occupancy', protect, authorizeRoles('government', 'ngo', 'admin'), updateCampOccupancy);
router.patch('/:id/inventory', protect, authorizeRoles('government', 'ngo', 'admin'), updateCampInventory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCamp);

export default router;
