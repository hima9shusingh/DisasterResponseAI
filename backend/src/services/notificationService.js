import Notification from '../models/Notification.js';
import { getIO } from './socketService.js';
import User from '../models/User.js';

/**
 * Creates a notification in DB and emits via socket to a specific room/user
 */
export const createAndEmitNotification = async (userId, data) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'medium',
      relatedEntity: data.relatedEntity,
      relatedEntityId: data.relatedEntityId
    });

    try {
      const io = getIO();
      io.to(`user:${userId}`).emit('notification:new', {
        notification: {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          createdAt: notification.createdAt
        }
      });
    } catch (e) {
      // Socket not initialized or error sending, ignore (it's saved in DB)
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

/**
 * Notify a specific user
 */
export const notifyUser = async (userId, data) => {
  return await createAndEmitNotification(userId, data);
};

/**
 * Notify an array of user IDs
 */
export const notifyUsers = async (userIds, data) => {
  const promises = userIds.map(id => createAndEmitNotification(id, data));
  await Promise.all(promises);
};

/**
 * Notify all active users of a specific role
 */
export const notifyRole = async (role, data) => {
  try {
    const users = await User.find({ role, isActive: true }).select('_id');
    const userIds = users.map(u => u._id);
    await notifyUsers(userIds, data);
  } catch (error) {
    console.error('Failed to notify role:', error.message);
  }
};

/**
 * Notify specific room with a generic event (does not save to User DB necessarily, 
 * use this for real-time progress updates that don't need persistent notifications)
 */
export const emitToRoom = (room, event, payload) => {
  try {
    const io = getIO();
    io.to(room).emit(event, payload);
  } catch (e) {
    // Socket not initialized
  }
};

/**
 * Find users associated with an incident (e.g. government/admin) to notify
 */
export const notifyIncidentParticipants = async (incidentId, data) => {
  try {
    // Usually notify all government/admin, plus any assigned teams?
    // Simplify: notify government & admin role for now.
    await notifyRole('government', data);
    await notifyRole('admin', data);
  } catch (error) {
    console.error(error);
  }
};
