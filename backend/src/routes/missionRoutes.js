import express from 'express';
import {
  createMission,
  getMissions,
  getMissionById,
  getMyMissions,
  acceptMission,
  startJourney,
  arriveOnSite,
  startRescue,
  updateMissionProgress,
  completeMission
} from '../controllers/missionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('government', 'admin'), createMission);
router.get('/', protect, authorizeRoles('government', 'admin'), getMissions);
router.get('/my', protect, authorizeRoles('volunteer'), getMyMissions);
router.get('/:id', protect, authorizeRoles('government', 'admin', 'volunteer'), getMissionById);

router.patch('/:id/accept', protect, authorizeRoles('volunteer'), acceptMission);
router.patch('/:id/start', protect, authorizeRoles('volunteer'), startJourney);
router.patch('/:id/arrive', protect, authorizeRoles('volunteer'), arriveOnSite);
router.patch('/:id/start-rescue', protect, authorizeRoles('volunteer'), startRescue);
router.patch('/:id/progress', protect, authorizeRoles('volunteer'), updateMissionProgress);
router.patch('/:id/complete', protect, authorizeRoles('volunteer', 'government', 'admin'), completeMission);

export default router;
