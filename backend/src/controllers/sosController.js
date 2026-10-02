import SOSRequest from '../models/SOSRequest.js';
import Mission from '../models/Mission.js';
import RescueTeam from '../models/RescueTeam.js';
import { notifyRole, notifyUser, emitToRoom } from '../services/notificationService.js';
import generateSOSId from '../utils/generateSOSId.js';
import generateMissionId from '../utils/generateMissionId.js';

export const createSOS = async (req, res, next) => {
  try {
    const { emergencyType, description, location } = req.body;
    const userId = req.user ? req.user._id : null;

    const emergencyId = await generateSOSId();

    const sos = await SOSRequest.create({
      emergencyId,
      userId,
      emergencyType: emergencyType || 'general_emergency',
      description,
      location,
      priority: 'critical', // SOS is always critical by default
    });

    const notificationData = {
      title: 'New Emergency SOS',
      message: `Emergency SOS triggered: ${emergencyId}. Immediate action required.`,
      type: 'sos_alert',
      priority: 'critical',
      relatedEntity: 'SOSRequest',
      relatedEntityId: sos._id,
    };

    // Notify Admins and Government/Responders
    await notifyRole('admin', notificationData);
    await notifyRole('government', notificationData);

    emitToRoom('role:admin', 'sos:created', { sos });
    emitToRoom('role:government', 'sos:created', { sos });

    res.status(201).json({
      success: true,
      message: 'SOS triggered successfully',
      data: { sos },
    });
  } catch (error) {
    next(error);
  }
};

export const getSOSRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const sosRequests = await SOSRequest.find(filter)
      .populate('userId', 'name phone email')
      .populate('assignedTeam')
      .populate('assignedMission')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { sosRequests },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSOSStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTeam, assignedMission } = req.body;

    const sos = await SOSRequest.findById(id);
    if (!sos) {
      return res.status(404).json({ success: false, message: 'SOS not found' });
    }

    if (status) sos.status = status;
    if (assignedMission) sos.assignedMission = assignedMission;
    
    // Mission creation if assignedTeam is provided and not already assigned
    if (assignedTeam && !sos.assignedTeam) {
      sos.assignedTeam = assignedTeam;
      
      const team = await RescueTeam.findById(assignedTeam);
      if (team && (team.status === 'available' || team.status === 'assigned')) {
        const missionId = await generateMissionId();
        const mission = await Mission.create({
          missionId,
          sosRequest: sos._id,
          team: team._id,
          priority: 'critical',
          instructions: `Respond to SOS Emergency: ${sos.emergencyId}`,
          location: sos.location,
          status: 'assigned',
        });
        
        sos.assignedMission = mission._id;
        
        // Update Team
        team.currentMission = mission._id;
        team.status = 'assigned';
        await team.save();
        
        // Notify team lead if applicable
        if (team.leader) {
          await notifyUser(team.leader, {
            title: 'New SOS Mission Assigned',
            message: `Your team has been assigned to an emergency SOS: ${sos.emergencyId}.`,
            type: 'mission_assignment',
            priority: 'critical'
          });
        }
      }
    }
    
    if (status === 'RESOLVED') {
      sos.resolvedAt = new Date();
    }

    await sos.save();

    // Populate for socket emission
    await sos.populate(['userId', 'assignedTeam', 'assignedMission']);

    emitToRoom('role:admin', 'sos:updated', { sos });
    emitToRoom('role:government', 'sos:updated', { sos });
    
    if (sos.userId) {
      emitToRoom(`user:${sos.userId}`, 'sos:updated', { sos });
    }

    res.status(200).json({
      success: true,
      message: 'SOS status updated',
      data: { sos },
    });
  } catch (error) {
    next(error);
  }
};

export const getMySOS = async (req, res, next) => {
  try {
    const sosRequests = await SOSRequest.find({ userId: req.user._id })
      .populate('assignedTeam')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      data: { sosRequests },
    });
  } catch (error) {
    next(error);
  }
};
