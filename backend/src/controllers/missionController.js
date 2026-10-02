import Mission from '../models/Mission.js';
import Incident from '../models/Incident.js';
import RescueTeam from '../models/RescueTeam.js';
import Resource from '../models/Resource.js';
import generateMissionId from '../utils/generateMissionId.js';
import mongoose from 'mongoose';
import { emitToRoom, notifyUser, notifyUsers } from '../services/notificationService.js';

export const createMission = async (req, res, next) => {
  try {
    const { incidentId, teamId, assignedResources, priority, instructions, location } = req.body;

    if (!incidentId || !teamId || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const incidentQuery = mongoose.Types.ObjectId.isValid(incidentId) ? { _id: incidentId } : { incidentId: incidentId };
    const incident = await Incident.findOne(incidentQuery);
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

    const teamQuery = mongoose.Types.ObjectId.isValid(teamId) ? { _id: teamId } : { teamId: teamId };
    const team = await RescueTeam.findOne(teamQuery);
    if (!team) return res.status(404).json({ success: false, message: 'Rescue team not found' });

    // Validate team availability/assignment
    if (team.status !== 'available' && team.status !== 'assigned') {
      return res.status(400).json({ success: false, message: 'Team is not available for a new mission' });
    }

    // Optional: Validate resources if provided
    let validResourceIds = [];
    if (assignedResources && assignedResources.length > 0) {
      for (const resId of assignedResources) {
        const resQuery = mongoose.Types.ObjectId.isValid(resId) ? { _id: resId } : { resourceId: resId };
        const resource = await Resource.findOne(resQuery);
        if (resource) {
          validResourceIds.push(resource._id);
        }
      }
    }

    const missionId = await generateMissionId();

    const mission = await Mission.create({
      missionId,
      incident: incident._id,
      team: team._id,
      assignedResources: validResourceIds,
      priority: priority || 'normal',
      instructions,
      location,
      status: 'assigned',
      progress: 0,
      peopleRescued: 0,
      peopleRemaining: incident.peopleAffected || 0
    });

    // Update Team
    team.currentMission = mission._id;
    team.status = 'assigned';
    team.assignedIncident = incident._id;
    await team.save();

    // Update Incident
    if (!incident.assignedTeams.includes(team._id)) {
      incident.assignedTeams.push(team._id);
    }
    if (incident.status === 'pending_verification' || incident.status === 'verified') {
      incident.status = 'resources_assigned';
    }
    
    incident.timeline.push({
      action: `Assigned Rescue Team: ${team.name}`,
      actor: req.user ? req.user.name : 'System',
      time: new Date()
    });
    
    await incident.save();

    // Notify assigned volunteer/team members
    const teamMembers = [];
    if (team.leader) teamMembers.push(team.leader.toString());
    if (team.members && Array.isArray(team.members)) {
      team.members.forEach(m => {
        if (m) teamMembers.push(m.toString());
      });
    }
    const uniqueTeamMembers = [...new Set(teamMembers)];
    
    const notifData = {
      type: 'mission',
      title: 'New Mission Assigned',
      message: `You have been assigned to mission ${mission.missionId}.`,
      priority: 'high',
      relatedEntity: 'Mission',
      relatedEntityId: mission._id
    };
    await notifyUsers(uniqueTeamMembers, notifData);
    emitToRoom(`mission:${mission._id}`, 'mission:created', { missionId: mission._id });

    res.status(201).json({ success: true, message: 'Mission created successfully', data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const getMissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, teamId, incidentId, city, district, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (teamId) {
      if (mongoose.Types.ObjectId.isValid(teamId)) query.team = teamId;
    }
    
    if (incidentId) {
      if (mongoose.Types.ObjectId.isValid(incidentId)) query.incident = incidentId;
    }

    if (search) {
      query.$or = [
        { missionId: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (district) query['location.district'] = { $regex: district, $options: 'i' };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const missions = await Mission.find(query)
      .populate('incident', 'incidentId disasterType status location severity')
      .populate('team', 'teamId name type leader')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Mission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        missions,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMissionById = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('incident', 'incidentId disasterType status location severity peopleAffected')
      .populate('team', 'teamId name type leader members')
      .populate('assignedResources', 'resourceId name type status');

    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    
    res.status(200).json({ success: true, data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const getMyMissions = async (req, res, next) => {
  try {
    // Find all teams where this volunteer is a leader or member
    const teams = await RescueTeam.find({
      $or: [
        { leader: req.user._id },
        { members: req.user._id }
      ]
    });

    const teamIds = teams.map(t => t._id);

    const { page = 1, limit = 10, status } = req.query;
    const query = { team: { $in: teamIds } };
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const missions = await Mission.find(query)
      .populate('incident', 'incidentId disasterType status location severity')
      .populate('team', 'teamId name type')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Mission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        missions,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyVolunteerMissionAccess = async (missionId, userId) => {
  const mission = await Mission.findById(missionId).populate('team');
  if (!mission) return { error: 'Mission not found', status: 404 };
  if (!mission.team) return { error: 'Mission has no assigned team', status: 400 };

  const isMember = (mission.team.leader && mission.team.leader.toString() === userId.toString()) || 
                   (mission.team.members && mission.team.members.some(id => id && id.toString() === userId.toString()));
  
  if (!isMember) {
    return { error: 'You do not have permission to modify this mission', status: 403 };
  }
  return { mission };
};

export const acceptMission = async (req, res, next) => {
  try {
    const { mission, error, status } = await verifyVolunteerMissionAccess(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    if (mission.status !== 'assigned') {
      return res.status(400).json({ success: false, message: 'Mission is not in assigned state' });
    }

    mission.status = 'accepted';
    await mission.save();

    emitToRoom(`mission:${mission._id}`, 'mission:accepted', { missionId: mission._id });

    res.status(200).json({ success: true, message: 'Mission accepted', data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const startJourney = async (req, res, next) => {
  try {
    const { mission, error, status } = await verifyVolunteerMissionAccess(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    if (mission.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Mission must be accepted before starting journey' });
    }

    mission.status = 'en_route';
    mission.startedAt = new Date();
    await mission.save();

    const team = await RescueTeam.findById(mission.team._id);
    if (team) {
      team.status = 'en_route';
      await team.save();
    }

    emitToRoom(`mission:${mission._id}`, 'mission:started', { missionId: mission._id });

    res.status(200).json({ success: true, message: 'Journey started', data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const arriveOnSite = async (req, res, next) => {
  try {
    const { mission, error, status } = await verifyVolunteerMissionAccess(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    if (mission.status !== 'en_route') {
      return res.status(400).json({ success: false, message: 'Mission must be en_route before arriving' });
    }

    mission.status = 'on_site';
    await mission.save();

    const team = await RescueTeam.findById(mission.team._id);
    if (team) {
      team.status = 'on_site';
      await team.save();
    }

    emitToRoom(`mission:${mission._id}`, 'mission:on_site', { missionId: mission._id });

    res.status(200).json({ success: true, message: 'Arrived on site', data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const startRescue = async (req, res, next) => {
  try {
    const { mission, error, status } = await verifyVolunteerMissionAccess(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    if (mission.status !== 'on_site') {
      return res.status(400).json({ success: false, message: 'Mission must be on_site before starting rescue' });
    }

    mission.status = 'rescue_in_progress';
    await mission.save();

    const team = await RescueTeam.findById(mission.team._id);
    if (team) {
      team.status = 'on_mission';
      await team.save();
    }

    const incident = await Incident.findById(mission.incident);
    if (incident && incident.status !== 'rescue_in_progress') {
      incident.status = 'rescue_in_progress';
      await incident.save();
    }

    emitToRoom(`mission:${mission._id}`, 'mission:rescue_started', { missionId: mission._id });

    res.status(200).json({ success: true, message: 'Rescue started', data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const updateMissionProgress = async (req, res, next) => {
  try {
    const { mission, error, status } = await verifyVolunteerMissionAccess(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    const { peopleRescued, peopleRemaining, progress, notes } = req.body;

    if (mission.status !== 'rescue_in_progress' && mission.status !== 'on_site') {
      return res.status(400).json({ success: false, message: 'Mission must be active to update progress' });
    }

    if (peopleRescued !== undefined) {
      if (peopleRescued < 0) return res.status(400).json({ success: false, message: 'Negative peopleRescued not allowed' });
      mission.peopleRescued = peopleRescued;
    }

    if (peopleRemaining !== undefined) {
      if (peopleRemaining < 0) return res.status(400).json({ success: false, message: 'Negative peopleRemaining not allowed' });
      mission.peopleRemaining = peopleRemaining;
    }

    if (progress !== undefined) {
      if (progress < 0 || progress > 100) return res.status(400).json({ success: false, message: 'Progress must be between 0 and 100' });
      mission.progress = progress;
    }

    if (notes) {
      mission.notes.push({
        text: notes,
        addedBy: req.user._id
      });
    }

    await mission.save();

    emitToRoom(`mission:${mission._id}`, 'mission:progress', {
      missionId: mission._id,
      progress: mission.progress,
      peopleRescued: mission.peopleRescued,
      peopleRemaining: mission.peopleRemaining
    });

    res.status(200).json({ success: true, message: 'Mission progress updated', data: { mission } });
  } catch (error) {
    next(error);
  }
};

export const completeMission = async (req, res, next) => {
  try {
    let mission = await Mission.findById(req.params.id).populate('team');
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });

    if (req.user.role === 'volunteer') {
      const isMember = (mission.team.leader && mission.team.leader.toString() === req.user._id.toString()) || 
                       (mission.team.members && mission.team.members.some(id => id && id.toString() === req.user._id.toString()));
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'You do not have permission to modify this mission' });
      }
    }

    if (mission.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Mission is already completed' });
    }

    if (mission.status !== 'rescue_in_progress' && req.user.role !== 'admin') {
      // allow admins to override, but strictly volunteers must be in progress
      return res.status(400).json({ success: false, message: 'Mission must be in progress to complete' });
    }

    mission.status = 'completed';
    mission.progress = 100;
    mission.completedAt = new Date();
    await mission.save();

    const team = await RescueTeam.findById(mission.team._id);
    if (team) {
      team.status = 'returning'; // Or 'available'
      team.currentMission = null;
      team.assignedIncident = null;
      await team.save();
    }

    // Check if other active missions remain for this incident
    const activeMissions = await Mission.countDocuments({
      incident: mission.incident,
      status: { $ne: 'completed' }
    });

    if (activeMissions === 0) {
      const incident = await Incident.findById(mission.incident);
      if (incident) {
        incident.status = 'resolved';
        incident.resolvedAt = new Date();
        await incident.save();
      }
    }

    emitToRoom(`mission:${mission._id}`, 'mission:completed', { missionId: mission._id });

    res.status(200).json({ success: true, message: 'Mission completed', data: { mission } });
  } catch (error) {
    next(error);
  }
};
