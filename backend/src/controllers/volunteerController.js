import User from '../models/User.js';
import Mission from '../models/Mission.js';

export const getVolunteerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerProfile = async (req, res, next) => {
  try {
    const { name, phone, location, skills } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (skills) user.skills = skills;

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    if (availability !== 'available' && availability !== 'unavailable') {
      return res.status(400).json({ success: false, message: 'Invalid availability status' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.availability = availability;
    await user.save();

    res.status(200).json({ success: true, message: 'Availability updated', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const getVolunteers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, skill, availability, city, district, search } = req.query;
    const query = { role: 'volunteer', isActive: true };

    if (availability) query.availability = availability;
    if (skill) query.skills = { $in: [skill] };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Using simple location string match since User.location is string
    if (city) {
      if (!query.$and) query.$and = [];
      query.$and.push({ location: { $regex: city, $options: 'i' } });
    }
    if (district) {
      if (!query.$and) query.$and = [];
      query.$and.push({ location: { $regex: district, $options: 'i' } });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const volunteers = await User.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        volunteers,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getVolunteerById = async (req, res, next) => {
  try {
    const volunteer = await User.findOne({ _id: req.params.id, role: 'volunteer' });
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });

    // Authorization check
    if (req.user.role === 'volunteer' && req.user._id.toString() !== volunteer._id.toString()) {
      return res.status(403).json({ success: false, message: 'You cannot view other volunteers' });
    }

    res.status(200).json({ success: true, data: { volunteer } });
  } catch (error) {
    next(error);
  }
};

export const getVolunteerStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // We fetch teams they belong to
    const RescueTeam = (await import('../models/RescueTeam.js')).default;
    const teams = await RescueTeam.find({
      $or: [{ leader: userId }, { members: userId }]
    });
    const teamIds = teams.map(t => t._id);

    // Calculate dynamic stats
    const allMissions = await Mission.find({ team: { $in: teamIds } });
    
    const missionsCompleted = allMissions.filter(m => m.status === 'completed').length;
    const activeMissions = allMissions.filter(m => m.status !== 'completed' && m.status !== 'assigned').length;
    
    let peopleAssisted = 0;
    allMissions.forEach(m => {
      if (m.peopleRescued) peopleAssisted += m.peopleRescued;
    });

    const stats = {
      missionsCompleted,
      activeMissions,
      peopleAssisted,
      totalAssignedMissions: allMissions.length
    };

    res.status(200).json({ success: true, data: { stats } });
  } catch (error) {
    next(error);
  }
};
