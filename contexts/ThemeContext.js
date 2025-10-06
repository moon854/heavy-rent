import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleSetting } from '../app/redux/Slices/HomeDataSlice';
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
    smsNotifications: false,
    autoTheme: false,
    highContrast: false,
    reduceMotion: false,
    largeText: false
  };

  const colors = Colors[theme] || Colors.light;

  const value = {
    theme: theme || 'light',
    colors,
    isDark: (theme || 'light') === 'dark',
    isLight: (theme || 'light') === 'light',
    toggleTheme: () => {
      try {
        const currentTheme = theme || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update both theme and darkMode setting together
        dispatch(setTheme(newTheme));
        dispatch(toggleSetting('darkMode'));
      } catch (error) {
        console.error('Error in toggleTheme:', error);
      }
    },
    setTheme: (newTheme) => {
      try {
        dispatch(setTheme(newTheme));
        // Update darkMode setting based on theme
        dispatch(toggleSetting('darkMode'));
      } catch (error) {
        console.error('Error in setTheme:', error);
      }
    },
    setLightMode: () => {
      try {
        dispatch(setTheme('light'));
        if (settings && settings.darkMode) {
          dispatch(toggleSetting('darkMode'));
        }
      } catch (error) {
        console.error('Error in setLightMode:', error);
      }
    },
    setDarkMode: () => {
      try {
        dispatch(setTheme('dark'));
        if (settings && !settings.darkMode) {
          dispatch(toggleSetting('darkMode'));
        }
      } catch (error) {
        console.error('Error in setDarkMode:', error);
      }
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
