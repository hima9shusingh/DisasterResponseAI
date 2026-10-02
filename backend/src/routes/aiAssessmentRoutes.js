import express from 'express';
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  reviewAssessment,
  deleteAssessment
} from '../controllers/aiAssessmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('government', 'admin'));

router.post('/', createAssessment);
router.get('/', getAssessments);
router.get('/:id', getAssessmentById);
router.patch('/:id/review', reviewAssessment);
router.delete('/:id', authorizeRoles('admin'), deleteAssessment);

export default router;
