import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { refreshUser } from '../redux/Slices/HomeDataSlice';

const Settings = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  const dispatch = useDispatch();
  
  // Force re-render when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Force refresh of user data when returning from ProfileEdit
      dispatch(refreshUser());
    }, [dispatch])
  );
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    locationServices: true,
    autoSync: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false
  });

  const toggleSetting = (settingName) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Privacy settings will be implemented soon!',
      [{ text: 'OK' }]
    );
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
      'About HeavyRent',
      'HeavyRent v1.0.0\n\nA platform for renting heavy machinery and construction equipment.\n\n© 2024 HeavyRent. All rights reserved.',
      [{ text: 'OK' }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'For support, please contact:\n\nEmail: support@heavyrent.com\nPhone: +1-800-HEAVY-RENT\n\nWe are here to help!',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: '#47D6FF' }}
          thumbColor={switchValue ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <Text key={`${user?.firstName}-${user?.lastName}`} style={styles.userName}>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.firstName || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
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
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon={<Ionicons name="notifications-outline" size={24} color="#47D6FF" />}
          title="Push Notifications"
          subtitle="Receive notifications on your device"
          showSwitch={true}
          switchValue={settings.pushNotifications}
          onSwitchChange={() => toggleSetting('pushNotifications')}
        />
        <SettingItem
          icon={<Ionicons name="mail-outline" size={24} color="#47D6FF" />}
          title="Email Notifications"
          subtitle="Receive notifications via email"
          showSwitch={true}
          switchValue={settings.emailNotifications}
          onSwitchChange={() => toggleSetting('emailNotifications')}
        />
        <SettingItem
          icon={<Ionicons name="chatbubble-outline" size={24} color="#47D6FF" />}
          title="SMS Notifications"
          subtitle="Receive notifications via SMS"
          showSwitch={true}
          switchValue={settings.smsNotifications}
          onSwitchChange={() => toggleSetting('smsNotifications')}
        />
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <SettingItem
          icon={<Ionicons name="moon-outline" size={24} color="#47D6FF" />}
          title="Dark Mode"
          subtitle="Switch to dark theme"
          showSwitch={true}
          switchValue={settings.darkMode}
          onSwitchChange={() => toggleSetting('darkMode')}
        />
        <SettingItem
          icon={<Ionicons name="volume-high-outline" size={24} color="#47D6FF" />}
          title="Sound"
          subtitle="Enable app sounds"
          showSwitch={true}
          switchValue={settings.soundEnabled}
          onSwitchChange={() => toggleSetting('soundEnabled')}
        />
        <SettingItem
          icon={<Ionicons name="phone-portrait-outline" size={24} color="#47D6FF" />}
          title="Vibration"
          subtitle="Enable haptic feedback"
          showSwitch={true}
          switchValue={settings.vibrationEnabled}
          onSwitchChange={() => toggleSetting('vibrationEnabled')}
        />
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <SettingItem
          icon={<Ionicons name="location-outline" size={24} color="#47D6FF" />}
          title="Location Services"
          subtitle="Allow location access for better service"
          showSwitch={true}
          switchValue={settings.locationServices}
          onSwitchChange={() => toggleSetting('locationServices')}
        />
        <SettingItem
          icon={<Ionicons name="sync-outline" size={24} color="#47D6FF" />}
          title="Auto Sync"
          subtitle="Automatically sync your data"
          showSwitch={true}
          switchValue={settings.autoSync}
          onSwitchChange={() => toggleSetting('autoSync')}
        />
        <SettingItem
          icon={<Ionicons name="folder-outline" size={24} color="#47D6FF" />}
          title="Data Management"
          subtitle="Manage your stored data"
          onPress={handleDataManagement}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
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
      <View style={styles.bottomSpacing} />
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


