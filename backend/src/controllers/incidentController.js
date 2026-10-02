import Incident from '../models/Incident.js';
import '../models/Resource.js';
import '../models/RescueTeam.js';
import EmergencyAlert from '../models/EmergencyAlert.js';
import User from '../models/User.js';
import generateIncidentId from '../utils/generateIncidentId.js';
import { notifyRole, emitToRoom, notifyIncidentParticipants } from '../services/notificationService.js';
import { assessIncidentRisk } from '../services/aiAssessmentService.js';
import fs from 'fs';
import path from 'path';

const generateAlertId = async () => {
  const year = new Date().getFullYear();
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

const triggerRiskAssessment = async (incident) => {
  try {
    const assessment = await assessIncidentRisk(incident);
    incident.riskScore = assessment.riskScore;
    incident.riskLevel = assessment.riskLevel;
    incident.assessmentMode = 'automated';
    
    // Add to timeline
    incident.timeline.push({
      action: `AI Risk Assessment completed: ${assessment.riskLevel} (${assessment.riskScore}/100)`,
      actor: 'AI Assessment System',
      time: new Date()
    });
    await incident.save();

    if (assessment.riskLevel === 'CRITICAL' || assessment.riskLevel === 'HIGH') {
      const alertId = await generateAlertId();
      
      let creatorId = incident.reportedBy;
      if (!creatorId) {
        const adminUser = await User.findOne({ role: 'admin' });
        creatorId = adminUser ? adminUser._id : null;
      }

      if (creatorId) {
        const newAlert = await EmergencyAlert.create({
          alertId,
          title: `Automatic Alert: ${incident.disasterType} in ${incident.location?.city || 'Unknown Region'}`,
          type: incident.disasterType || 'general_emergency',
          severity: assessment.riskLevel === 'CRITICAL' ? 'critical' : 'warning',
          targetRegion: incident.location?.city || incident.location?.district || incident.location?.state || 'Unknown',
          description: `Automated alert generated due to ${assessment.riskLevel} risk assessment for incident ${incident.incidentId}.`,
          instructions: 'Please review incident details and deploy resources immediately.',
          startTime: new Date(),
          status: 'active',
          createdBy: creatorId
        });

        const notificationData = {
          type: 'emergency_alert',
          title: `Emergency Alert Activated: ${newAlert.title}`,
          message: newAlert.description,
          priority: newAlert.severity === 'critical' ? 'high' : 'medium',
          relatedEntity: 'EmergencyAlert',
          relatedEntityId: newAlert._id
        };
        
        notifyRole('admin', notificationData);
        notifyRole('government', notificationData);
        
        emitToRoom('role:admin', 'emergency-alert:active', newAlert);
        emitToRoom('role:government', 'emergency-alert:active', newAlert);
      }
    }
  } catch (error) {
    console.error('AI Assessment failed for incident:', incident._id, error);
  }
};

export const createIncident = async (req, res, next) => {
  try {
    const { disasterType, description, severity, location, peopleAffected, contactNumber } = req.body;

    const errors = {};
    if (!disasterType) errors.disasterType = 'Disaster Type is required';
    if (!description) errors.description = 'Description is required';
    if (!severity) errors.severity = 'Severity is required';
    if (!location) errors.location = 'Location information is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude',
      });
    }

    if (peopleAffected !== undefined && peopleAffected < 0) {
      return res.status(400).json({
        success: false,
        message: 'People affected cannot be negative',
      });
    }

    const incidentId = await generateIncidentId();

    const incident = await Incident.create({
      incidentId,
      reportedBy: req.user._id,
      disasterType,
      description,
      severity,
      location,
      peopleAffected,
      contactNumber,
      status: 'pending_verification',
      reportedAt: new Date(),
      timeline: [{
        action: 'Incident reported',
        actor: req.user ? req.user.name : 'System',
        time: new Date()
      }]
    });

    // Notify government/admin
    const notificationData = {
      type: 'incident',
      title: 'New Critical Incident',
      message: `A new ${severity} severity ${disasterType} incident has been reported in ${location.city}.`,
      priority: severity === 'high' || severity === 'critical' ? 'high' : 'medium',
      relatedEntity: 'Incident',
      relatedEntityId: incident._id
    };
    
    await notifyRole('government', notificationData);
    await notifyRole('admin', notificationData);
    emitToRoom('role:government', 'incident:created', { incidentId: incident._id });
    emitToRoom('role:admin', 'incident:created', { incidentId: incident._id });

    // Trigger AI Risk Assessment in background (awaited so it can be returned, but has internal try-catch)
    await triggerRiskAssessment(incident);

    res.status(201).json({
      success: true,
      message: 'Incident created successfully',
      data: {
        incident,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPublicIncident = async (req, res, next) => {
  try {
    const { disasterType, description, severity, location, peopleAffected, contactNumber } = req.body;

    const errors = {};
    if (!disasterType) errors.disasterType = 'Disaster Type is required';
    if (!description) errors.description = 'Description is required';
    if (!severity) errors.severity = 'Severity is required';
    if (!location) errors.location = 'Location information is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude',
      });
    }

    if (peopleAffected !== undefined && peopleAffected < 0) {
      return res.status(400).json({
        success: false,
        message: 'People affected cannot be negative',
      });
    }

    const incidentId = await generateIncidentId();

    const incident = await Incident.create({
      incidentId,
      reporterType: 'guest',
      disasterType,
      description,
      severity,
      location,
      peopleAffected,
      contactNumber,
      status: 'pending_verification',
      reportedAt: new Date(),
      timeline: [{
        action: 'Incident reported by guest',
        actor: 'Guest Citizen',
        time: new Date()
      }]
    });

    const notificationData = {
      type: 'incident',
      title: 'New Critical Incident (Guest Report)',
      message: `A new \${severity} severity \${disasterType} incident has been reported in \${location.city} by a guest.`,
      priority: severity === 'high' || severity === 'critical' ? 'high' : 'medium',
      relatedEntity: 'Incident',
      relatedEntityId: incident._id
    };
    
    await notifyRole('government', notificationData);
    await notifyRole('admin', notificationData);
    emitToRoom('role:government', 'incident:created', { incidentId: incident._id });
    emitToRoom('role:admin', 'incident:created', { incidentId: incident._id });

    // Trigger AI Risk Assessment in background (awaited so it can be returned)
    await triggerRiskAssessment(incident);

    res.status(201).json({
      success: true,
      message: 'Emergency reported successfully',
      data: {
        incident,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, disasterType, severity, status, state, district, city, search } = req.query;
    const query = { isArchived: { $ne: true } };

    if (disasterType) query.disasterType = disasterType;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (city) query['location.city'] = city;

    if (search) {
      query.$or = [
        { incidentId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const incidents = await Incident.find(query)
      .populate('reportedBy', 'name role')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Incident.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        incidents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } })
      .populate('reportedBy', 'name role')
      .populate('assignedResources')
      .populate('assignedTeams');

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Citizens can only view incidents they are authorized to access (their own)
    if (req.user.role === 'citizen') {
      const isOwner = incident.reportedBy && incident.reportedBy._id.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this incident',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        incident,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyIncidents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, disasterType } = req.query;
    const query = { reportedBy: req.user._id, isArchived: { $ne: true } };

    if (status) query.status = status;
    if (disasterType) query.disasterType = disasterType;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const incidents = await Incident.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Incident.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        incidents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateIncident = async (req, res, next) => {
  try {
    const { description, severity, location, peopleAffected, contactNumber, riskScore, riskLevel } = req.body;

    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    if (description) incident.description = description;
    if (severity) incident.severity = severity;
    if (location) incident.location = location;
    if (peopleAffected !== undefined) incident.peopleAffected = peopleAffected;
    if (contactNumber) incident.contactNumber = contactNumber;

    // Handle Human Override for Risk Assessment
    if (riskScore !== undefined || riskLevel !== undefined) {
      if (riskScore !== incident.riskScore || riskLevel !== incident.riskLevel) {
        incident.riskScore = riskScore !== undefined ? riskScore : incident.riskScore;
        incident.riskLevel = riskLevel !== undefined ? riskLevel : incident.riskLevel;
        incident.assessmentMode = 'overridden';
        
        incident.timeline.push({
          action: `Risk Assessment manually overridden to ${incident.riskLevel} (${incident.riskScore}/100)`,
          actor: req.user ? req.user.name : 'System Admin',
          time: new Date()
        });
      }
    }

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: {
        incident,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    if (incident.status !== 'pending_verification') {
      return res.status(400).json({
        success: false,
        message: `Cannot verify incident with status: ${incident.status}`,
      });
    }

    incident.status = 'verified';
    incident.verifiedAt = new Date();
    incident.timeline.push({
      action: 'Incident verified',
      actor: req.user ? req.user.name : 'Admin',
      time: new Date()
    });
    await incident.save();

    const notifData = {
      type: 'incident',
      title: 'Incident Verified',
      message: `Incident ${incident.incidentId} has been verified.`,
      priority: 'medium',
      relatedEntity: 'Incident',
      relatedEntityId: incident._id
    };
    await notifyIncidentParticipants(incident._id, notifData);
    emitToRoom(`incident:${incident._id}`, 'incident:updated', { incidentId: incident._id, status: 'verified' });

    res.status(200).json({
      success: true,
      message: 'Incident verified successfully',
      data: {
        incident,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      const validTransitions = {
        'pending_verification': ['verified', 'resolved'],
        'verified': ['resources_assigned', 'resolved'],
        'resources_assigned': ['rescue_in_progress', 'resolved'],
        'rescue_in_progress': ['resolved'],
        'resolved': [],
      };

      if (
        !validTransitions[incident.status] ||
        !validTransitions[incident.status].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${incident.status} to ${status}`,
        });
      }
    }

    incident.status = status;
    if (status === 'resolved') {
      incident.resolvedAt = new Date();
    }
    
    incident.timeline.push({
      action: `Status updated to ${status.replace(/_/g, ' ')}`,
      actor: req.user ? req.user.name : 'System',
      time: new Date()
    });

    await incident.save();

    const notifData = {
      type: 'incident',
      title: 'Incident Status Updated',
      message: `Incident ${incident.incidentId} status changed to ${status}.`,
      priority: 'medium',
      relatedEntity: 'Incident',
      relatedEntityId: incident._id
    };
    await notifyIncidentParticipants(incident._id, notifData);
    emitToRoom(`incident:${incident._id}`, 'incident:updated', { incidentId: incident._id, status });

    res.status(200).json({
      success: true,
      message: 'Incident status updated successfully',
      data: {
        incident,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Soft delete
    incident.isArchived = true;
    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Incident archived successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const uploadIncidentEvidence = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (req.user.role === 'citizen') {
      const isOwner = incident.reportedBy && incident.reportedBy.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You do not have permission to upload evidence for this incident' });
      }
    }

    const images = req.files.filter(f => f.mimetype.startsWith('image/'));
    const videos = req.files.filter(f => f.mimetype.startsWith('video/'));

    if (images.length > 5 || videos.length > 2) {
      for (const file of req.files) {
        await fs.promises.unlink(file.path).catch(() => {});
      }
      return res.status(400).json({ success: false, message: 'Exceeded maximum file limits (5 images, 2 videos)' });
    }

    for (const file of req.files) {
      if (file.mimetype.startsWith('image/') && file.size > 10 * 1024 * 1024) {
         for (const f of req.files) { await fs.promises.unlink(f.path).catch(() => {}); }
         return res.status(400).json({ success: false, message: `Image \${file.originalname} exceeds 10MB limit` });
      }
      if (file.mimetype.startsWith('video/') && file.size > 50 * 1024 * 1024) {
         for (const f of req.files) { await fs.promises.unlink(f.path).catch(() => {}); }
         return res.status(400).json({ success: false, message: `Video \${file.originalname} exceeds 50MB limit` });
      }
    }

    const uploadedImages = images.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/incidents/\${file.filename}`,
      uploadedBy: req.user._id
    }));

    const uploadedVideos = videos.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/incidents/\${file.filename}`,
      uploadedBy: req.user._id
    }));

    if (!incident.evidence) {
        incident.evidence = { images: [], videos: [] };
    }
    incident.evidence.images.push(...uploadedImages);
    incident.evidence.videos.push(...uploadedVideos);

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Evidence uploaded successfully',
      data: {
        images: uploadedImages,
        videos: uploadedVideos
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getIncidentEvidence = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } })
      .populate('evidence.images.uploadedBy', 'name role')
      .populate('evidence.videos.uploadedBy', 'name role');

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (req.user.role === 'citizen') {
      const isOwner = incident.reportedBy && incident.reportedBy.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You do not have permission to view this incident evidence' });
      }
    }

    res.status(200).json({
      success: true,
      data: incident.evidence || { images: [], videos: [] }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIncidentEvidence = async (req, res, next) => {
  try {
    const { evidenceId } = req.params;
    const incident = await Incident.findOne({ _id: req.params.id, isArchived: { $ne: true } });

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    let evidenceType = null;
    let evidenceItem = incident.evidence?.images?.id(evidenceId);
    
    if (evidenceItem) {
        evidenceType = 'images';
    } else {
        evidenceItem = incident.evidence?.videos?.id(evidenceId);
        if (evidenceItem) evidenceType = 'videos';
    }

    if (!evidenceItem) {
      return res.status(404).json({ success: false, message: 'Evidence not found' });
    }

    if (req.user.role === 'citizen') {
      const isOwner = evidenceItem.uploadedBy && evidenceItem.uploadedBy.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You do not have permission to delete this evidence' });
      }
    }

    const filePath = path.join(process.cwd(), 'uploads', 'incidents', evidenceItem.filename);
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.warn(`File \${filePath} already deleted or missing`);
    }

    incident.evidence[evidenceType].pull(evidenceId);
    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Evidence deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
