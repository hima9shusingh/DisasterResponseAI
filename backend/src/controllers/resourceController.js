import Resource from '../models/Resource.js';
import Incident from '../models/Incident.js';
import generateResourceId from '../utils/generateResourceId.js';
import { notifyRole, emitToRoom } from '../services/notificationService.js';
import mongoose from 'mongoose';

export const createResource = async (req, res, next) => {
  try {
    const { name, type, department, location, totalUnits, availableUnits, contactPerson, contactNumber } = req.body;

    if (!name || !type || totalUnits === undefined || availableUnits === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const resourceId = await generateResourceId();

    const resource = await Resource.create({
      resourceId,
      name,
      type,
      department,
      location,
      totalUnits,
      availableUnits,
      contactPerson,
      contactNumber,
      status: 'available'
    });

    res.status(201).json({ success: true, message: 'Resource created successfully', data: { resource } });
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status, department, city, district, search } = req.query;
    const query = { isArchived: { $ne: true } };

    if (type) query.type = type;
    if (status) query.status = status;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { resourceId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Add JSON string location filters logic if location is a string representation, 
    // or if the frontend sends city/district params to match against location string.
    if (city || district) {
      const locRegexes = [];
      if (city) locRegexes.push({ location: { $regex: city, $options: 'i' } });
      if (district) locRegexes.push({ location: { $regex: district, $options: 'i' } });
      if (locRegexes.length > 0) {
        if (!query.$and) query.$and = [];
        query.$and.push(...locRegexes);
      }
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const resources = await Resource.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        resources,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, isArchived: { $ne: true } })
      .populate('assignedIncident', 'incidentId status location severity')
      .populate('currentMission');

    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    res.status(200).json({ success: true, data: { resource } });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const { name, department, location, contactPerson, contactNumber, totalUnits, status } = req.body;
    
    const resource = await Resource.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    if (name) resource.name = name;
    if (department) resource.department = department;
    if (location) resource.location = location;
    if (contactPerson) resource.contactPerson = contactPerson;
    if (contactNumber) resource.contactNumber = contactNumber;
    if (totalUnits !== undefined) {
      const diff = totalUnits - resource.totalUnits;
      resource.totalUnits = totalUnits;
      resource.availableUnits += diff;
      if (resource.availableUnits < 0) resource.availableUnits = 0;
    }
    if (status) resource.status = status;

    resource.lastUpdated = new Date();
    await resource.save();

    res.status(200).json({ success: true, message: 'Resource updated successfully', data: { resource } });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    resource.isArchived = true;
    await resource.save();
    res.status(200).json({ success: true, message: 'Resource archived successfully' });
  } catch (error) {
    next(error);
  }
};

export const assignResource = async (req, res, next) => {
  try {
    const { incidentId, quantity } = req.body;
    
    const qty = quantity ? parseInt(quantity, 10) : 1;

    const incidentQuery = mongoose.Types.ObjectId.isValid(incidentId) 
      ? { _id: incidentId } 
      : { incidentId: incidentId };

    const incident = await Incident.findOne(incidentQuery);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const resource = await Resource.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.availableUnits < qty) {
      return res.status(400).json({ success: false, message: `Resource is unavailable (only ${resource.availableUnits} units available)` });
    }

    if (resource.assignedIncident && resource.assignedIncident.toString() === incident._id.toString()) {
      return res.status(409).json({ success: false, message: 'Resource already assigned to this incident' });
    }

    resource.availableUnits -= qty;
    resource.deployedUnits += qty;
    resource.assignedIncident = incident._id;
    resource.status = resource.availableUnits === 0 ? 'deployed' : 'partially_available';
    await resource.save();

    try {
      if (!incident.assignedResources.includes(resource._id)) {
        incident.assignedResources.push(resource._id);
      }
      
      if (incident.status === 'pending_verification' || incident.status === 'verified') {
        incident.status = 'resources_assigned';
      }
      incident.timeline.push({
        action: `Assigned ${qty} units of ${resource.name}`,
        actor: req.user ? req.user.name : 'System',
        time: new Date()
      });
      await incident.save();
    } catch (err) {
      // Manual rollback
      resource.availableUnits += qty;
      resource.deployedUnits -= qty;
      resource.assignedIncident = null;
      resource.status = 'available';
      await resource.save();
      throw err;
    }

    res.status(200).json({ success: true, message: 'Resource assigned successfully', data: { resource } });
  } catch (error) {
    next(error);
  }
};

export const releaseResource = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (!resource.assignedIncident) {
      return res.status(400).json({ success: false, message: 'Resource is not assigned to any incident' });
    }

    const incident = await Incident.findById(resource.assignedIncident);
    
    resource.assignedIncident = null;
    resource.status = 'available';
    if (resource.deployedUnits > 0) {
      resource.deployedUnits -= 1;
      resource.availableUnits += 1;
    }
    await resource.save();

    if (incident) {
      try {
        incident.assignedResources = incident.assignedResources.filter(id => id.toString() !== resource._id.toString());
        await incident.save();
      } catch (err) {
        console.error('Failed to update incident on resource release', err);
      }
    }

    res.status(200).json({ success: true, message: 'Resource released successfully', data: { resource } });
  } catch (error) {
    next(error);
  }
};
