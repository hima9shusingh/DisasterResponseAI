import React, { createContext, useContext, useState, useEffect } from 'react';

import { getStoredUser, setStoredUser, setToken, clearAuth, getToken } from '../utils/authStorage.js';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStoredUser() || null;
  });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsInitializing(false);
        return;
      }
      
      try {
        const response = await authService.getCurrentUser();
        if (response?.success) {
          setStoredUser(response.data.user);
          setUser(response.data.user);
        }
      } catch (error) {
        console.warn('Failed to restore session. Backend might be unreachable.');
        // If a 401 occurred, interceptor calls clearAuth().
        if (error.response?.status === 401) {
          setUser(null);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token = null) => {
    if (token) {
      setToken(token);
    }
    setStoredUser(userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};
