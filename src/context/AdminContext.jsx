import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  mockAdminUsers, 
  mockRolesAndPermissions, 
  mockAdminLogs,
  mockSystemHealth,
  mockAdminNotifications
} from '../data/mock/adminMockData';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState(mockAdminUsers);
  const [roles, setRoles] = useState(mockRolesAndPermissions);
  const [logs, setLogs] = useState(mockAdminLogs);
  const [health] = useState(mockSystemHealth);
  const [notifications, setNotifications] = useState(mockAdminNotifications);

  // User Actions
  const updateUserStatus = useCallback((id, status) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // Role Actions
  const updateRolePermission = useCallback((roleName, permissionKey, value) => {
    setRoles(prev => prev.map(r => {
      if (r.role === roleName) {
        return { ...r, permissions: { ...r.permissions, [permissionKey]: value } };
      }
      return r;
    }));
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AdminContext.Provider value={{
      users,
      roles,
      logs,
      health,
      notifications,
      updateUserStatus,
      deleteUser,
      updateRolePermission,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </AdminContext.Provider>
  );
};
