import express from 'express';
import {
  createRescueTeam,
  getRescueTeams,
  getRescueTeamById,
  updateRescueTeam,
  assignRescueTeam,
  releaseRescueTeam
} from '../controllers/rescueTeamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('government', 'admin'), createRescueTeam);
router.get('/', protect, authorizeRoles('government', 'admin', 'volunteer'), getRescueTeams);
router.get('/:id', protect, authorizeRoles('government', 'admin', 'volunteer'), getRescueTeamById);
router.put('/:id', protect, authorizeRoles('government', 'admin'), updateRescueTeam);
router.patch('/:id/assign', protect, authorizeRoles('government', 'admin'), assignRescueTeam);
router.patch('/:id/release', protect, authorizeRoles('government', 'admin'), releaseRescueTeam);

export default router;
