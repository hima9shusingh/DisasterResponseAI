import User from '../models/User.js';
import Incident from '../models/Incident.js';
import Mission from '../models/Mission.js';
import Resource from '../models/Resource.js';
import ReliefCamp from '../models/ReliefCamp.js';
import EmergencyAlert from '../models/EmergencyAlert.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive, isVerified, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password') // Ensure password is not returned
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Admins cannot deactivate their own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User \${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['citizen', 'volunteer', 'ngo', 'government', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Admins cannot change their own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Admins cannot delete their own account' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Soft delete / deactivate
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemStats = async (req, res, next) => {
  try {
    // Basic user stats
    const [
      totalUsers,
      totalCitizens,
      totalVolunteers,
      totalNGOs,
      totalGovernmentUsers,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      
      // Other system stats
      totalIncidents,
      totalMissions,
      totalResources,
      totalReliefCamps,
      totalAlerts,
      criticalIncidents,
      highRiskIncidents,
      activeAlerts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'citizen' }),
      User.countDocuments({ role: 'volunteer' }),
      User.countDocuments({ role: 'ngo' }),
      User.countDocuments({ role: 'government' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      
      Incident.countDocuments({ isArchived: { $ne: true } }),
      Mission.countDocuments(),
      Resource.countDocuments({ isArchived: { $ne: true } }),
      ReliefCamp.countDocuments({ isArchived: { $ne: true } }),
      EmergencyAlert.countDocuments(),
      
      // Risk stats
      Incident.countDocuments({ isArchived: { $ne: true }, riskLevel: 'CRITICAL' }),
      Incident.countDocuments({ isArchived: { $ne: true }, riskLevel: 'HIGH' }),
      EmergencyAlert.countDocuments({ status: 'active' })
    ]);

    const recentAlerts = await EmergencyAlert.find({ status: 'active' }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        users: {
          totalUsers,
          totalCitizens,
          totalVolunteers,
          totalNGOs,
          totalGovernmentUsers,
          totalAdmins,
          activeUsers,
          inactiveUsers
        },
        system: {
          totalIncidents,
          totalMissions,
          totalResources,
          totalReliefCamps,
          totalAlerts,
          criticalIncidents,
          highRiskIncidents,
          activeAlerts,
          recentAlerts
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
