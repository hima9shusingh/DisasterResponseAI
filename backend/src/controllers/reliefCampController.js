import ReliefCamp from '../models/ReliefCamp.js';
import generateCampId from '../utils/generateCampId.js';
import { emitToRoom } from '../services/notificationService.js';

export const createCamp = async (req, res, next) => {
  try {
    const { name, location, capacity, contactPerson, contactNumber } = req.body;

    if (!name || !location || capacity === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const campId = await generateCampId();

    const camp = await ReliefCamp.create({
      campId,
      name,
      location,
      capacity,
      contactPerson,
      contactNumber,
      occupied: 0,
      availableBeds: capacity,
      status: 'active',
      inventory: {
        food: 0, water: 0, medicine: 0, blankets: 0, emergencyKits: 0
      }
    });

    res.status(201).json({ success: true, message: 'Relief camp created successfully', data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const getCamps = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, state, district, city, status, search } = req.query;
    const query = { isArchived: { $ne: true } };

    if (status) query.status = status;
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (city) query['location.city'] = city;

    if (search) {
      query.$or = [
        { campId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const camps = await ReliefCamp.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await ReliefCamp.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        camps,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCampById = async (req, res, next) => {
  try {
    const camp = await ReliefCamp.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });
    
    res.status(200).json({ success: true, data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const updateCamp = async (req, res, next) => {
  try {
    const { name, location, capacity, contactPerson, contactNumber, status, medicalSupport } = req.body;

    const camp = await ReliefCamp.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });

    if (name) camp.name = name;
    if (location) camp.location = location;
    if (contactPerson) camp.contactPerson = contactPerson;
    if (contactNumber) camp.contactNumber = contactNumber;
    if (medicalSupport) camp.medicalSupport = { ...camp.medicalSupport, ...medicalSupport };
    if (status) camp.status = status;

    if (capacity !== undefined) {
      if (capacity < camp.occupied) {
        return res.status(400).json({ success: false, message: 'Capacity cannot be less than current occupied beds' });
      }
      camp.capacity = capacity;
      camp.availableBeds = capacity - camp.occupied;
    }

    await camp.save();
    res.status(200).json({ success: true, message: 'Relief camp updated', data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const updateCampOccupancy = async (req, res, next) => {
  try {
    const { occupied } = req.body;
    
    if (occupied === undefined || occupied < 0) {
      return res.status(400).json({ success: false, message: 'Invalid occupied value' });
    }

    const camp = await ReliefCamp.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });

    if (occupied > camp.capacity) {
      return res.status(400).json({ success: false, message: 'Occupied cannot exceed capacity' });
    }

    camp.occupied = occupied;
    camp.availableBeds = camp.capacity - occupied;

    const occupancyRate = camp.occupied / camp.capacity;
    if (occupancyRate >= 1) {
      camp.status = 'full';
    } else if (occupancyRate >= 0.8) {
      camp.status = 'near_capacity';
    } else {
      camp.status = 'active';
    }

    await camp.save();
    
    emitToRoom(`camp:${camp._id}`, 'camp:occupancy_updated', { campId: camp._id, occupied, availableBeds: camp.availableBeds, status: camp.status });

    res.status(200).json({ success: true, message: 'Camp occupancy updated', data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const updateCampInventory = async (req, res, next) => {
  try {
    const { item, quantity, operation } = req.body;

    const supportedItems = ['food', 'water', 'medicine', 'blankets', 'emergencyKits'];
    if (!supportedItems.includes(item)) {
      return res.status(400).json({ success: false, message: 'Invalid inventory item' });
    }
    
    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be positive' });
    }

    if (operation !== 'add' && operation !== 'remove') {
      return res.status(400).json({ success: false, message: 'Operation must be add or remove' });
    }

    const camp = await ReliefCamp.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });

    if (operation === 'add') {
      camp.inventory[item] += quantity;
    } else if (operation === 'remove') {
      if (camp.inventory[item] - quantity < 0) {
        return res.status(400).json({ success: false, message: 'Inventory cannot become negative' });
      }
      camp.inventory[item] -= quantity;
    }

    await camp.save();
    
    emitToRoom(`camp:${camp._id}`, 'camp:inventory_updated', { campId: camp._id, item, quantity: camp.inventory[item] });

    res.status(200).json({ success: true, message: 'Camp inventory updated', data: { camp } });
  } catch (error) {
    next(error);
  }
};

export const deleteCamp = async (req, res, next) => {
  try {
    const camp = await ReliefCamp.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });

    camp.isArchived = true;
    await camp.save();
    res.status(200).json({ success: true, message: 'Relief camp archived successfully' });
  } catch (error) {
    next(error);
  }
};
