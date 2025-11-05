import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { refreshUser, toggleSetting, updateSettings } from '../redux/Slices/HomeDataSlice';
import notificationService from '../services/NotificationService';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = ({ navigation }) => {
  // Safe state access with comprehensive fallbacks
  const homeState = useSelector((state) => state?.home) || {};
  const user = homeState.user || {};
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
  const dispatch = useDispatch();
  const { colors, isDark, toggleTheme, theme } = useTheme();
  
  // Force re-render when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Force refresh of user data when returning from ProfileEdit
      dispatch(refreshUser());
    }, [dispatch])
  );

  const handleToggleSetting = (settingName) => {
    try {
      if (settingName) {
        dispatch(toggleSetting(settingName));
      }
    } catch (error) {
      console.error('Error toggling setting:', error);
    }
  };

  const handleTogglePushNotifications = async () => {
    try {
      const currentlyOn = !!settings.pushNotifications;
      if (!currentlyOn) {
        // Turn ON: request permission and register token
        const status = await notificationService.requestNotificationPermissions();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Enable notifications in system settings to receive alerts.'
          );
          // Ensure state remains OFF
          dispatch(updateSettings({ pushNotifications: false }));
          return;
        }
        const token = await notificationService.registerForPushNotificationsAsync();
        if (!token) {
          // Token may be null in Expo Go or if something failed; still mark on for local notifications
          console.log('Push token not available; local notifications will still work.');
        }
        dispatch(updateSettings({ pushNotifications: true }));
        Alert.alert('Notifications Enabled', 'You will receive push notifications.');
      } else {
        // Turn OFF: cancel scheduled notifications locally
        try {
          await notificationService.cancelAllNotifications();
        } catch {}
        dispatch(updateSettings({ pushNotifications: false }));
      }
    } catch (error) {
      console.error('Push notifications toggle error:', error);
      Alert.alert('Error', 'Could not update push notifications setting.');
    }
  };

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handlePrivacySettings = () => {
    navigation.navigate('PrivacySettings');
  };

  const handleNotificationSettings = () => {
    navigation.navigate('NotificationSettings');
  };

  const handleThemeSettings = () => {
    navigation.navigate('ThemeSettings');
  };

  const handleDataManagement = () => {
    Alert.alert(
      'Data Management',
      'Data management features will be implemented soon!',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Rent-To-Build',
      'Rent-To-Build v1.0.0\n\nA platform for renting heavy machinery and construction equipment.\n\n© 2024 Rent-To-Build. All rights reserved.',
      [{ text: 'OK' }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'For support, please contact:\n\nEmail: amaarkhann77@gmail.com\nPhone: +92 327 749 0073\n\nWe are here to help!',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange }) => (
    <TouchableOpacity 
      style={dynamicStyles.settingItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={dynamicStyles.settingIcon}>
        {icon}
      </View>
      <View style={dynamicStyles.settingContent}>
        <Text style={dynamicStyles.settingTitle}>{title}</Text>
        {subtitle && <Text style={dynamicStyles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={switchValue ? colors.textInverse : colors.textSecondary}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: 50,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textInverse,
    },
    placeholder: {
      width: 34,
    },
    userSection: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 12,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userInfo: {
      alignItems: 'center',
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 5,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 10,
      marginLeft: 5,
    },
    settingItem: {
      backgroundColor: colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 8,
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingIcon: {
      marginRight: 15,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    bottomSpacing: {
      height: 30,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
        <View style={dynamicStyles.placeholder} />
      </View>

      {/* User Info Section */}
      <View style={dynamicStyles.userSection}>
        <View style={dynamicStyles.userInfo}>
          <Text key={`${user?.firstName}-${user?.lastName}`} style={dynamicStyles.userName}>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.firstName || 'User'}
          </Text>
          <Text style={dynamicStyles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      {/* Account Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Account</Text>
        <SettingItem
          icon={<Ionicons name="person-outline" size={24} color="#47D6FF" />}
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={handleProfileEdit}
        />
        <SettingItem
          icon={<MaterialIcons name="lock-outline" size={24} color="#47D6FF" />}
          title="Change Password"
          subtitle="Update your account password"
          onPress={handleChangePassword}
        />
        <SettingItem
          icon={<Ionicons name="shield-checkmark-outline" size={24} color="#47D6FF" />}
          title="Privacy Settings"
          subtitle="Manage your privacy preferences"
          onPress={handlePrivacySettings}
        />
        {/* Notification Settings entry removed as requested */}
        {/* Theme Settings entry removed as requested */}
      </View>

      {/* Notification Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon={<Ionicons name="notifications-outline" size={24} color="#47D6FF" />}
          title="Push Notifications"
          subtitle="Receive notifications on your device"
          showSwitch={true}
          switchValue={settings.pushNotifications}
          onSwitchChange={handleTogglePushNotifications}
        />
        {/* Email and SMS notification toggles removed as requested */}
      </View>

      {/* App Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>App Preferences</Text>
        <SettingItem
          icon={<Ionicons name="moon-outline" size={24} color="#47D6FF" />}
          title="Dark Mode"
          subtitle="Switch to dark theme"
          showSwitch={true}
          switchValue={isDark}
          onSwitchChange={() => {
            try {
              toggleTheme();
            } catch (error) {
              console.error('Error toggling dark mode:', error);
            }
          }}
        />
        {/* Sound and Vibration toggles removed as requested */}
      </View>

      {/* Data & Privacy */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Data & Privacy</Text>
        {/* Location Services, Auto Sync, and Data Management removed as requested */}
      </View>

      {/* Support */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Support</Text>
        <SettingItem
          icon={<Ionicons name="help-circle-outline" size={24} color="#47D6FF" />}
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={handleHelpSupport}
        />
        <SettingItem
          icon={<Ionicons name="information-circle-outline" size={24} color="#47D6FF" />}
          title="About"
          subtitle="App version and information"
          onPress={handleAbout}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={dynamicStyles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#47D6FF',
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  userSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default Settings;


