import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useToast } from './ToastContext';
import { notificationService } from '../services/notificationService';
import { alertService } from '../services/alertService';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const { socket, isConnected } = useSocket();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [notifsRes, countRes] = await Promise.all([
        notificationService.getNotifications({ limit: 50 }),
        notificationService.getUnreadCount()
      ]);
      if (notifsRes.success) setNotifications(notifsRes.data.notifications);
      if (countRes.success) setUnreadCount(countRes.data.count);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [isAuthenticated]);

  const fetchActiveAlert = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await alertService.getActiveAlerts();
      if (res.success && res.data.length > 0) {
        // Show the most critical or recent active alert
        setActiveEmergencyAlert(res.data[0]);
      } else {
        setActiveEmergencyAlert(null);
      }
    } catch (error) {
      console.error('Failed to fetch active alerts', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isInitializing) return;

    if (isAuthenticated) {
      fetchNotifications();
      fetchActiveAlert();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setActiveEmergencyAlert(null);
    }
  }, [isAuthenticated, isInitializing, fetchNotifications, fetchActiveAlert]);

  // Handle Socket reconnection (re-fetch missed notifications/alerts)
  useEffect(() => {
    if (isConnected) {
      fetchNotifications();
      fetchActiveAlert();
    }
  }, [isConnected, fetchNotifications, fetchActiveAlert]);

  // Setup Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotif) => {
      setNotifications(prev => {
        // Duplicate check
        if (prev.some(n => n._id === newNotif._id)) return prev;
        return [newNotif, ...prev];
      });
      setUnreadCount(prev => prev + 1);

      // Show toast depending on priority/type
      const toastType = newNotif.priority === 'critical' ? 'error' : 
                        newNotif.priority === 'high' ? 'warning' : 'info';
      
      addToast(newNotif.title, newNotif.message, toastType);
    };

    const handleEmergencyAlert = (data) => {
      // Data might be the alert document or a notification payload
      if (data && data._id && data.status === 'active') {
        setActiveEmergencyAlert(data);
      }
      
      addToast(
        data.title || 'EMERGENCY ALERT',
        data.description || data.message || 'A new emergency alert has been issued.',
        'error'
      );
      // Fetch full notifications list to ensure it's captured in the center
      fetchNotifications();
      fetchActiveAlert();
    };

    const handleEmergencyAlertResolved = (data) => {
      setActiveEmergencyAlert(prev => {
        if (prev && prev._id === data._id) return null;
        return prev;
      });
      fetchActiveAlert();
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('emergency-alert:active', handleEmergencyAlert);
    socket.on('emergency-alert:resolved', handleEmergencyAlertResolved);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('emergency-alert:active', handleEmergencyAlert);
      socket.off('emergency-alert:resolved', handleEmergencyAlertResolved);
    };
  }, [socket, addToast, fetchNotifications, fetchActiveAlert]);

  const markAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error(err);
      fetchNotifications(); // revert on failure
    }
  };

  const markAsUnread = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: false } : n));
      setUnreadCount(prev => prev + 1);
      await notificationService.markAsUnread(id);
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  const deleteNotification = async (id) => {
    try {
      const notif = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (notif && !notif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      await notificationService.deleteNotification(id);
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      activeEmergencyAlert,
      markAsRead,
      markAsUnread,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
