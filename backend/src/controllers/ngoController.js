import User from '../models/User.js';
import ReliefCamp from '../models/ReliefCamp.js';
import SupplyRequest from '../models/SupplyRequest.js';
import mongoose from 'mongoose';

export const getNgoProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateNgoProfile = async (req, res, next) => {
  try {
    const { organizationName, phone, operatingRegions, missionStatement } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (organizationName) user.organizationName = organizationName;
    if (phone) user.phone = phone;
    if (operatingRegions) user.operatingRegions = operatingRegions;
    if (missionStatement) user.missionStatement = missionStatement;

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const getNgoVolunteers = async (req, res, next) => {
  try {
    const { skill, availability, city, district, search } = req.query;
    const query = { role: 'volunteer', isActive: true };

    if (availability) query.availability = availability;
    if (skill) query.skills = { $in: [skill] };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city) {
      if (!query.$and) query.$and = [];
      query.$and.push({ location: { $regex: city, $options: 'i' } });
    }
    if (district) {
      if (!query.$and) query.$and = [];
      query.$and.push({ location: { $regex: district, $options: 'i' } });
    }

    const volunteers = await User.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, data: { volunteers } });
  } catch (error) {
    next(error);
  }
};

export const assignVolunteerToCamp = async (req, res, next) => {
  try {
    const { volunteerId } = req.body;
    
    const volunteer = await User.findOne({ _id: volunteerId, role: 'volunteer', isActive: true });
    if (!volunteer) return res.status(404).json({ success: false, message: 'Active volunteer not found' });
    if (volunteer.availability !== 'available') return res.status(400).json({ success: false, message: 'Volunteer is unavailable' });

    const camp = await ReliefCamp.findById(req.params.campId);
    if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });

    // Ensure NGO manages this camp (Admin/Gov can bypass)
    if (req.user.role === 'ngo' && (!camp.managedBy || camp.managedBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'You do not manage this camp' });
    }

    if (camp.assignedVolunteers.includes(volunteer._id)) {
      return res.status(400).json({ success: false, message: 'Volunteer is already assigned to this camp' });
    }

    camp.assignedVolunteers.push(volunteer._id);
    await camp.save();

    res.status(200).json({ success: true, message: 'Volunteer assigned successfully', data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const removeVolunteerFromCamp = async (req, res, next) => {
  try {
    const { volunteerId } = req.body;
    
    const camp = await ReliefCamp.findById(req.params.campId);
    if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });

    if (req.user.role === 'ngo' && (!camp.managedBy || camp.managedBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'You do not manage this camp' });
    }

    camp.assignedVolunteers = camp.assignedVolunteers.filter(v => v.toString() !== volunteerId.toString());
    await camp.save();

    res.status(200).json({ success: true, message: 'Volunteer removed successfully', data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const getNgoCamps = async (req, res, next) => {
  try {
    const camps = await ReliefCamp.find({ managedBy: req.user._id, isArchived: { $ne: true } })
      .populate('assignedVolunteers', 'name email skills phone');
    res.status(200).json({ success: true, data: { camps } });
  } catch (error) {
    next(error);
  }
};

export const getNgoSupplyRequests = async (req, res, next) => {
  try {
    const { status, priority, category, campId, page = 1, limit = 10 } = req.query;
    const query = { requestedBy: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (campId) query.camp = campId;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const requests = await SupplyRequest.find(query)
      .populate('camp', 'name location')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
      
    const total = await SupplyRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getNgoDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const camps = await ReliefCamp.find({ managedBy: userId, isArchived: { $ne: true } });
    const managedCamps = camps.length;
    const activeCamps = camps.filter(c => c.status === 'active' || c.status === 'near_capacity').length;

    let assignedVolunteers = 0;
    let peopleSupported = 0;
    const uniqueVolunteers = new Set();
    
    camps.forEach(c => {
      peopleSupported += c.occupied;
      c.assignedVolunteers.forEach(v => uniqueVolunteers.add(v.toString()));
    });
    assignedVolunteers = uniqueVolunteers.size;

    const requests = await SupplyRequest.find({ requestedBy: userId });
    const pendingSupplyRequests = requests.filter(r => r.status === 'pending').length;
    const approvedRequests = requests.filter(r => r.status === 'approved' || r.status === 'in_transit').length;
    const deliveredRequests = requests.filter(r => r.status === 'delivered').length;

    const stats = {
      managedCamps,
      activeCamps,
      assignedVolunteers,
      peopleSupported,
      pendingSupplyRequests,
      approvedRequests,
      deliveredRequests
    };

    res.status(200).json({ success: true, data: { stats } });
  } catch (error) {
    next(error);
  }
};
