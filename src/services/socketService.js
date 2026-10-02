import { io } from 'socket.io-client';
import { getToken } from '../utils/authStorage.js';

let socket = null;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  // Socket.io typically connects to the root origin
  try {
    const url = new URL(apiUrl);
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    return apiUrl.replace('/api/v1', '');
  }
};

export const socketService = {
  connectSocket: () => {
    if (socket && socket.connected) {
      return socket;
    }

    const token = getToken();
    if (!token) {
      console.warn('Attempted to connect to Socket.IO without a JWT token');
      return null;
    }

    const socketUrl = getSocketUrl();
    
    socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
      if (error.message.includes('Authentication error')) {
        // Disconnect immediately to prevent infinite reconnect loops on invalid tokens
        socket.disconnect();
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    return socket;
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => {
    return socket;
  },

  isSocketConnected: () => {
    return socket ? socket.connected : false;
  }
};
