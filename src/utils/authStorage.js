/**
 * Auth Storage Utility
 * Manages JWT tokens and basic user info in localStorage securely.
 */

const TOKEN_KEY = 'adrras_token';
const USER_KEY = 'adrras_user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error('Failed to parse stored user', e);
      return null;
    }
  }
  return null;
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = () => {
  removeToken();
  removeStoredUser();
};
