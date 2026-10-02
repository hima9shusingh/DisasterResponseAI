import SupplyRequest from '../models/SupplyRequest.js';
import ReliefCamp from '../models/ReliefCamp.js';
import generateRequestId from '../utils/generateRequestId.js';
import { emitToRoom, notifyRole, notifyUser } from '../services/notificationService.js';

export const createSupplyRequest = async (req, res, next) => {
  try {
    const { campId, item, category, quantity, priority, reason, requiredBy } = req.body;

    if (!campId || !item || !category || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const camp = await ReliefCamp.findOne({ _id: campId, isArchived: { $ne: true } });
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });

    const requestId = await generateRequestId();

    const supplyRequest = await SupplyRequest.create({
      requestId,
      camp: camp._id,
      requestedBy: req.user._id,
      item,
      category,
      quantity,
      priority: priority || 'medium',
      reason,
      requiredBy,
      status: 'pending'
    });

    const notifData = {
      type: 'relief',
      title: 'New Supply Request',
      message: `A new supply request for ${quantity} ${item} has been created for camp ${camp.name}.`,
      priority: priority || 'medium',
      relatedEntity: 'SupplyRequest',
      relatedEntityId: supplyRequest._id
    };
    
    await notifyRole('government', notifData);
    if (camp.managedBy) {
      await notifyUser(camp.managedBy, notifData);
    }
    
    emitToRoom('role:government', 'supply-request:created', { requestId: supplyRequest._id });

    res.status(201).json({ success: true, message: 'Supply request created successfully', data: { supplyRequest } });
  } catch (error) {
    next(error);
  }
};

export const getSupplyRequests = async (req, res, next) => {
  try {
    const { status, priority, category, campId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (campId) query.camp = campId;

    // Optional: NGO users might only see their own requests or camps they manage.
    // For now, implementing platform wide for admin/gov, but if user is NGO, maybe limit to requests they created?
    // "NGO users should only see requests relevant to their authorized operations."
    if (req.user.role === 'ngo') {
      query.requestedBy = req.user._id;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const requests = await SupplyRequest.find(query)
      .populate('camp', 'campId name location')
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

export const getSupplyRequestById = async (req, res, next) => {
  try {
    const supplyRequest = await SupplyRequest.findById(req.params.id)
      .populate('camp', 'campId name location contactPerson contactNumber status')
      .populate('requestedBy', 'name email role');

    if (!supplyRequest) return res.status(404).json({ success: false, message: 'Supply request not found' });
    
    if (req.user.role === 'ngo' && supplyRequest.requestedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to view this request' });
    }

    res.status(200).json({ success: true, data: { supplyRequest } });
  } catch (error) {
    next(error);
  }
};

export const updateSupplyRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const request = await SupplyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Supply request not found' });

    // Idempotency check: if already delivered, do not deliver again.
    if (request.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Request is already delivered' });
    }
    
    // Status transition validation
    const validTransitions = {
      'pending': ['approved', 'rejected'],
      'approved': ['in_transit', 'rejected'],
      'in_transit': ['delivered'],
      'delivered': [],
      'rejected': []
    };

    if (!validTransitions[request.status] || !validTransitions[request.status].includes(status)) {
      if (req.user.role !== 'admin') {
        return res.status(400).json({ success: false, message: `Invalid status transition from ${request.status} to ${status}` });
      }
    }

    if (req.user.role === 'ngo' && (status === 'approved' || status === 'rejected' || status === 'in_transit')) {
      return res.status(403).json({ success: false, message: 'NGOs cannot approve, reject, or mark requests as in transit' });
    }

    if (req.user.role === 'ngo' && request.requestedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to update this request' });
    }

    request.status = status;
    await request.save();

    // If delivered, update camp inventory
    if (status === 'delivered') {
      const camp = await ReliefCamp.findById(request.camp);
      if (camp) {
        // Map category to inventory item if exact match or close match.
        // Categories: food, water, medicine, blankets, clothing, emergency_kits, sanitary_supplies
        // Inventory fields: food, water, medicine, blankets, emergencyKits
        let inventoryKey = null;
        if (request.category === 'emergency_kits') inventoryKey = 'emergencyKits';
        else if (['food', 'water', 'medicine', 'blankets'].includes(request.category)) {
          inventoryKey = request.category;
        }

        if (inventoryKey) {
          camp.inventory[inventoryKey] += request.quantity;
          await camp.save();
        }
      }
    }

    const notifData = {
      type: 'relief',
      title: 'Supply Request Updated',
      message: `Supply request ${request.requestId} status changed to ${status}.`,
      priority: 'medium',
      relatedEntity: 'SupplyRequest',
      relatedEntityId: request._id
    };
    
    await notifyUser(request.requestedBy, notifData);
    
    if (status === 'in_transit' || status === 'delivered') {
      const camp = await ReliefCamp.findById(request.camp);
      if (camp && camp.managedBy) {
        await notifyUser(camp.managedBy, notifData);
      }
    }

    emitToRoom(`user:${request.requestedBy}`, 'supply-request:updated', { requestId: request._id, status });

    res.status(200).json({ success: true, message: 'Supply request status updated', data: { request } });
  } catch (error) {
    next(error);
  }
};
