import express from 'express';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  assignResource,
  releaseResource
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('government', 'admin'), createResource);
router.get('/', protect, authorizeRoles('government', 'admin'), getResources);
router.get('/:id', protect, authorizeRoles('government', 'admin', 'volunteer'), getResourceById);
router.put('/:id', protect, authorizeRoles('government', 'admin'), updateResource);
router.delete('/:id', protect, authorizeRoles('admin'), deleteResource);
router.patch('/:id/assign', protect, authorizeRoles('government', 'admin'), assignResource);
router.patch('/:id/release', protect, authorizeRoles('government', 'admin'), releaseResource);

export default router;
