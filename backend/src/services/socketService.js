import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userId = decoded.userId || decoded.id;
      
      // Fetch user to verify role and status
      const user = await User.findById(userId).select('role isActive');
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: User invalid or inactive'));
      }

      // Attach minimal user info
      socket.user = {
        id: user._id.toString(),
        role: user.role
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // 1. Join personal private room for direct notifications
    socket.join(`user:${socket.user.id}`);
    
    // 2. Join role-based room (e.g. role:government)
    socket.join(`role:${socket.user.role}`);

    // Helpers to dynamically join/leave operational rooms
    socket.on('join_room', async (room) => {
      const { role, id } = socket.user;
      let allowed = false;

      if (room.startsWith('incident:')) {
        if (role !== 'citizen') {
          allowed = true;
        } else {
          try {
            const incidentId = room.split(':')[1];
            const incident = await User.db.model('Incident').findById(incidentId).select('reportedBy');
            if (incident && incident.reportedBy && incident.reportedBy.toString() === id) {
              allowed = true;
            }
          } catch (e) {}
        }
      } else if (room.startsWith('mission:')) {
        if (['admin', 'government', 'volunteer'].includes(role)) allowed = true;
      } else if (room.startsWith('camp:')) {
        if (['admin', 'government', 'ngo', 'volunteer', 'citizen'].includes(role)) allowed = true;
      }

      if (allowed) {
        socket.join(room);
      }
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      // Clean up automatically handled by socket.io
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized');
  }
  return io;
};
