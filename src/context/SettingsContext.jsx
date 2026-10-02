import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [theme, setTheme] = useState(() => localStorage.getItem('adrras_theme') || 'light');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('adrras_compact') === 'true');
  
  // Dummy preferences for UI demo
  const [preferences, setPreferences] = useState({
    notifications: {
      emergency: true,
      weather: true,
      incident: true,
      mission: true,
      system: false
    }
  });

  // Apply theme class to HTML element
  useEffect(() => {
    localStorage.setItem('adrras_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply compact class to HTML element
  useEffect(() => {
    localStorage.setItem('adrras_compact', compactMode);
    if (compactMode) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
  }, [compactMode]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleCompactMode = () => setCompactMode(prev => !prev);
  const updatePreference = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <SettingsContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      compactMode,
      toggleCompactMode,
      preferences,
      updatePreference,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
