import RescueTeam from '../models/RescueTeam.js';
import Incident from '../models/Incident.js';
import generateTeamId from '../utils/generateTeamId.js';
import mongoose from 'mongoose';

export const createRescueTeam = async (req, res, next) => {
  try {
    const { name, type, leader, members, memberCount, location, contactNumber } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const teamId = await generateTeamId();

    const team = await RescueTeam.create({
      teamId,
      name,
      type,
      leader,
      members: members || [],
      memberCount: memberCount || (members ? members.length : 0),
      location,
      contactNumber,
      status: 'available'
    });

    res.status(201).json({ success: true, message: 'Rescue team created successfully', data: { team } });
  } catch (error) {
    next(error);
  }
};

export const getRescueTeams = async (req, res, next) => {
  try {
    const { type, status, city, district, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { teamId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city || district) {
      const locRegexes = [];
      if (city) locRegexes.push({ location: { $regex: city, $options: 'i' } });
      if (district) locRegexes.push({ location: { $regex: district, $options: 'i' } });
      if (locRegexes.length > 0) {
        if (!query.$and) query.$and = [];
        query.$and.push(...locRegexes);
      }
    }

    const teams = await RescueTeam.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { teams } });
  } catch (error) {
    next(error);
  }
};

export const getRescueTeamById = async (req, res, next) => {
  try {
    const team = await RescueTeam.findById(req.params.id)
      .populate('assignedIncident', 'incidentId status severity location')
      .populate('currentMission');
      
    if (!team) return res.status(404).json({ success: false, message: 'Rescue team not found' });
    
    res.status(200).json({ success: true, data: { team } });
  } catch (error) {
    next(error);
  }
};

export const updateRescueTeam = async (req, res, next) => {
  try {
    const { name, type, leader, members, location, contactNumber, status } = req.body;

    const team = await RescueTeam.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Rescue team not found' });

    if (name) team.name = name;
    if (type) team.type = type;
    if (leader) team.leader = leader;
    if (members) {
      team.members = members;
      team.memberCount = members.length;
    }
    if (location) team.location = location;
    if (contactNumber) team.contactNumber = contactNumber;
    if (status) team.status = status;

    await team.save();

    res.status(200).json({ success: true, message: 'Rescue team updated successfully', data: { team } });
  } catch (error) {
    next(error);
  }
};

export const assignRescueTeam = async (req, res, next) => {
  try {
    const { incidentId } = req.body;
    const incidentQuery = mongoose.Types.ObjectId.isValid(incidentId) ? { _id: incidentId } : { incidentId: incidentId };
    const incident = await Incident.findOne(incidentQuery);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const team = await RescueTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Rescue team not found' });
    }

    if (team.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Team is unavailable' });
    }
    
    if (team.assignedIncident && team.assignedIncident.toString() === incident._id.toString()) {
      return res.status(409).json({ success: false, message: 'Team already assigned to this incident' });
    }

    team.status = 'assigned';
    team.assignedIncident = incident._id;
    await team.save();

    try {
      if (!incident.assignedTeams.includes(team._id)) {
        incident.assignedTeams.push(team._id);
      }
      if (incident.status === 'pending_verification' || incident.status === 'verified') {
        incident.status = 'resources_assigned';
      }
      await incident.save();
    } catch (err) {
      // Manual rollback
      team.status = 'available';
      team.assignedIncident = null;
      await team.save();
      throw err;
    }

    res.status(200).json({ success: true, message: 'Team assigned successfully', data: { team } });
  } catch (error) {
    next(error);
  }
};

export const releaseRescueTeam = async (req, res, next) => {
  try {
    const team = await RescueTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Rescue team not found' });
    }

    if (!team.assignedIncident) {
      return res.status(400).json({ success: false, message: 'Team is not assigned to any incident' });
    }

    const incident = await Incident.findById(team.assignedIncident);

    team.status = 'available';
    team.assignedIncident = null;
    await team.save();

    if (incident) {
      try {
        incident.assignedTeams = incident.assignedTeams.filter(id => id.toString() !== team._id.toString());
        await incident.save();
      } catch (err) {
        console.error('Failed to update incident on team release', err);
      }
    }

    res.status(200).json({ success: true, message: 'Team released successfully', data: { team } });
  } catch (error) {
    next(error);
  }
};
