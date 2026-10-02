import express from 'express';
import {
  getDashboardAnalytics,
  getIncidentTrendStats,
  getRegionalAnalyticsStats,
  getResourceUtilizationStats,
  getMissionPerformanceStats,
  downloadIncidentReportCsv
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Analytics routes are protected and restricted to government and admin roles
router.use(protect);
router.use(authorizeRoles('government', 'admin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/incidents/trend', getIncidentTrendStats);
router.get('/regions', getRegionalAnalyticsStats);
router.get('/resources/utilization', getResourceUtilizationStats);
router.get('/missions/performance', getMissionPerformanceStats);
router.get('/export/incidents', downloadIncidentReportCsv);

export default router;
