import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../app/redux/Slices/HomeDataSlice';
import { Colors } from '../constants/Colors';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Safe state access with comprehensive fallbacks
  const homeState = useSelector((state) => state?.home) || {};
  const theme = homeState.theme || 'light';
  const settings = homeState.settings || {
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    locationServices: true,
    autoSync: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false
  };

  // Update theme when darkMode setting changes
  useEffect(() => {
    if (settings && typeof settings === 'object' && settings.hasOwnProperty('darkMode')) {
      const darkMode = settings.darkMode || false;
      const newTheme = darkMode ? 'dark' : 'light';
      if (newTheme !== theme) {
        dispatch(setTheme(newTheme));
      }
    }
  }, [settings?.darkMode, theme, dispatch]);

  const colors = Colors[theme] || Colors.light;

  const value = {
    theme: theme || 'light',
    colors,
    isDark: (theme || 'light') === 'dark',
    toggleTheme: () => {
      const currentTheme = theme || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      dispatch(setTheme(newTheme));
    }
  };

  // Don't render until we have valid state
  if (!homeState || typeof homeState !== 'object') {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
