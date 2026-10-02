import express from 'express';
import authRoutes from './authRoutes.js';
import testRoutes from './testRoutes.js';
import incidentRoutes from './incidentRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import rescueTeamRoutes from './rescueTeamRoutes.js';
import missionRoutes from './missionRoutes.js';
import reliefCampRoutes from './reliefCampRoutes.js';
import supplyRequestRoutes from './supplyRequestRoutes.js';
import volunteerRoutes from './volunteerRoutes.js';
import ngoRoutes from './ngoRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import emergencyAlertRoutes from './emergencyAlertRoutes.js';
import aiAssessmentRoutes from './aiAssessmentRoutes.js';
import adminRoutes from './adminRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import weatherRoutes from './weatherRoutes.js';
import sosRoutes from './sosRoutes.js';

const router = express.Router();

import mongoose from 'mongoose';

// Health endpoint
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };
  
  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    message: dbState === 1 ? 'ADRRAS API is running' : 'ADRRAS API degraded - DB unavailable',
    apiStatus: 'online',
    databaseStatus: dbStatusMap[dbState] || 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/test', testRoutes);
router.use('/incidents', incidentRoutes);
router.use('/resources', resourceRoutes);
router.use('/rescue-teams', rescueTeamRoutes);
router.use('/missions', missionRoutes);
router.use('/relief-camps', reliefCampRoutes);
router.use('/supply-requests', supplyRequestRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/ngos', ngoRoutes);
router.use('/notifications', notificationRoutes);
router.use('/alerts', emergencyAlertRoutes);
router.use('/weather', weatherRoutes);
router.use('/ai-assessments', aiAssessmentRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/sos', sosRoutes);

export default router;
