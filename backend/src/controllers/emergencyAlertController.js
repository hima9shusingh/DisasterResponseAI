import EmergencyAlert from '../models/EmergencyAlert.js';
import { createAndEmitNotification, emitToRoom, notifyRole } from '../services/notificationService.js';

// Helper to generate Alert ID
const generateAlertId = async () => {
  const year = new Date().getFullYear();
  // Find the last alert created this year to increment
  const lastAlert = await EmergencyAlert.findOne({ alertId: new RegExp(`^ADR-ALT-${year}-`) })
    .sort({ createdAt: -1 })
    .exec();

  let sequence = 1;
  if (lastAlert) {
    const parts = lastAlert.alertId.split('-');
    sequence = parseInt(parts[3], 10) + 1;
  }
  return `ADR-ALT-${year}-${sequence.toString().padStart(5, '0')}`;
};

export const createAlert = async (req, res, next) => {
  try {
    const {
      title,
      type,
      severity,
      targetRegion,
      description,
      instructions,
      startTime,
      endTime,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (severity === 'critical' && (!description || !instructions)) {
      return res.status(400).json({ success: false, message: 'Critical alerts require description and instructions' });
    }
    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    const alertId = await generateAlertId();

    const newAlert = await EmergencyAlert.create({
      alertId,
      title,
      type,
      severity,
      targetRegion: typeof targetRegion === 'object' ? JSON.stringify(targetRegion) : targetRegion,
      description,
      instructions,
      startTime,
      endTime,
      status: status || 'draft',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: newAlert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, severity, status, state, district, city } = req.query;
    const query = {};

    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    // For simplicity, we search targetRegion as string if they pass location
    if (state) query.targetRegion = new RegExp(state, 'i');
    if (district) query.targetRegion = new RegExp(district, 'i');
    if (city) query.targetRegion = new RegExp(city, 'i');

    const alerts = await EmergencyAlert.find(query)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await EmergencyAlert.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveAlerts = async (req, res, next) => {
  try {
    const now = new Date();
    
    // Expire alerts that are past end time if status is active
    await EmergencyAlert.updateMany(
      { status: 'active', endTime: { $lt: now } },
      { $set: { status: 'expired' } }
    );

    const alerts = await EmergencyAlert.find({
      status: 'active',
      startTime: { $lte: now },
      $or: [{ endTime: { $gte: now } }, { endTime: { $exists: false } }, { endTime: null }]
    }).populate('createdBy', 'name role');

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlertById = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id)
      .populate('createdBy', 'name role');

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAlert = async (req, res, next) => {
  try {
    const { title, description, instructions, severity, targetRegion, startTime, endTime } = req.body;
    
    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    let parsedRegion = targetRegion;
    if (typeof targetRegion === 'object') {
        parsedRegion = JSON.stringify(targetRegion);
    }

    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        instructions,
        severity,
        ...(parsedRegion && { targetRegion: parsedRegion }),
        startTime,
        endTime
      },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const activateAlert = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    ).populate('createdBy', 'name role');

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // Emit via Socket
    emitToRoom('role:citizen', 'emergency-alert:active', alert);
    emitToRoom('role:volunteer', 'emergency-alert:active', alert);
    emitToRoom('role:ngo', 'emergency-alert:active', alert);
    emitToRoom('role:government', 'emergency-alert:active', alert);

    // Using notifyRole since we don't have region-based rooms, and it's an emergency alert
    const notificationData = {
      type: 'emergency_alert',
      title: `Emergency Alert Activated: \${alert.title}`,
      message: alert.description,
      priority: alert.severity === 'critical' ? 'high' : 'medium',
      relatedEntity: 'EmergencyAlert',
      relatedEntityId: alert._id
    };
    
    // We notify government/admin to confirm it's activated, maybe citizens too but that could be too many rows.
    // Given the constraints: "Notify users according to target region where practical. Do NOT send SMS or WhatsApp."
    // In our Notification Service, notifyRole saves a row per user in DB. We'll avoid saving thousands for citizens.
    notifyRole('admin', notificationData);
    notifyRole('government', notificationData);

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveAlert = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    ).populate('createdBy', 'name role');

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // Emit via Socket
    emitToRoom('role:citizen', 'emergency-alert:resolved', alert);
    emitToRoom('role:volunteer', 'emergency-alert:resolved', alert);
    emitToRoom('role:ngo', 'emergency-alert:resolved', alert);
    emitToRoom('role:government', 'emergency-alert:resolved', alert);

    const notificationData = {
      type: 'emergency_alert_resolved',
      title: `Emergency Alert Resolved: \${alert.title}`,
      message: `The alert \${alert.title} has been resolved.`,
      priority: 'low',
      relatedEntity: 'EmergencyAlert',
      relatedEntityId: alert._id
    };

    notifyRole('admin', notificationData);
    notifyRole('government', notificationData);

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // Prefer soft deletion (or just deleting if soft delete plugin isn't used)
    // We can just set status to 'expired' or 'resolved' or a new status 'deleted'
    // Since the schema doesn't have 'deleted', we'll physically delete or just leave it resolved
    // The instruction says "Prefer soft deletion", maybe I should just add an active flag or change status to 'expired'
    // For now, I'll delete it to keep it simple and schema compliant, or just set it to expired if active.
    // The schema enum for status is: ['draft', 'scheduled', 'active', 'expired', 'resolved'].
    // I will set it to expired or resolved as "soft delete" or actually delete if it's draft.
    
    if (alert.status === 'draft') {
        await alert.deleteOne();
    } else {
        alert.status = 'expired';
        await alert.save();
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
