import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSetting } from '../redux/Slices/HomeDataSlice';
import notificationService from '../services/NotificationService';

const NotificationSettings = ({ navigation }) => {
  const homeState = useSelector((state) => state?.home) || {};
  const settings = homeState.settings || {};
  const dispatch = useDispatch();
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const status = await notificationService.getNotificationPermissions();
    setPermissionStatus(status);
  };

  const handleToggleSetting = (settingName) => {
    dispatch(toggleSetting(settingName));
  };

  const handleRequestPermissions = async () => {
    const status = await notificationService.requestNotificationPermissions();
    setPermissionStatus(status);
    
    if (status === 'granted') {
      Alert.alert('Success', 'Notification permissions granted!');
      // Register for push notifications
      await notificationService.registerForPushNotificationsAsync();
    } else {
      Alert.alert('Permission Denied', 'Please enable notifications in your device settings.');
    }
  };

  const handleTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please grant notification permissions first.');
      return;
    }

    await notificationService.sendLocalNotification(
      'Test Notification 🧪',
      'This is a test notification from HeavyRent!',
      { type: 'test' }
    );
  };

  const handleClearAllNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'This will clear all scheduled notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: async () => {
            await notificationService.cancelAllNotifications();
            Alert.alert('Success', 'All notifications cleared!');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange, isDestructive = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, isDestructive && styles.destructiveItem]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>{title}</Text>
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

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Granted ✅';
      case 'denied':
        return 'Denied ❌';
      case 'undetermined':
        return 'Not Requested ⚠️';
      default:
        return 'Unknown ❓';
    }
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#4CAF50';
      case 'denied':
        return '#F44336';
      case 'undetermined':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

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
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Permission Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permission Status</Text>
        <View style={styles.permissionCard}>
          <View style={styles.permissionInfo}>
            <Ionicons name="notifications-outline" size={24} color={getPermissionStatusColor()} />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Notification Permissions</Text>
              <Text style={[styles.permissionStatus, { color: getPermissionStatusColor() }]}>
                {getPermissionStatusText()}
              </Text>
            </View>
          </View>
          {permissionStatus !== 'granted' && (
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={handleRequestPermissions}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* General Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Notifications</Text>
        <SettingItem
          icon={<Ionicons name="notifications-outline" size={24} color="#47D6FF" />}
          title="Push Notifications"
          subtitle="Receive notifications on your device"
          showSwitch={true}
          switchValue={settings.pushNotifications !== false}
          onSwitchChange={() => handleToggleSetting('pushNotifications')}
        />
        <SettingItem
          icon={<Ionicons name="volume-high-outline" size={24} color="#47D6FF" />}
          title="Notification Sound"
          subtitle="Play sound for notifications"
          showSwitch={true}
          switchValue={settings.notificationSound !== false}
          onSwitchChange={() => handleToggleSetting('notificationSound')}
        />
        <SettingItem
          icon={<Ionicons name="phone-portrait-outline" size={24} color="#47D6FF" />}
          title="Vibration"
          subtitle="Vibrate for notifications"
          showSwitch={true}
          switchValue={settings.notificationVibration !== false}
          onSwitchChange={() => handleToggleSetting('notificationVibration')}
        />
      </View>

      {/* Ad-Related Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ad-Related Notifications</Text>
        <SettingItem
          icon={<Ionicons name="add-circle-outline" size={24} color="#47D6FF" />}
          title="Ad Posted Confirmation"
          subtitle="Get notified when your ad is posted"
          showSwitch={true}
          switchValue={settings.adPostedNotification !== false}
          onSwitchChange={() => handleToggleSetting('adPostedNotification')}
        />
        <SettingItem
          icon={<Ionicons name="eye-outline" size={24} color="#47D6FF" />}
          title="Ad Views"
          subtitle="Get notified when someone views your ad"
          showSwitch={true}
          switchValue={settings.adViewNotification === true}
          onSwitchChange={() => handleToggleSetting('adViewNotification')}
        />
        <SettingItem
          icon={<Ionicons name="hand-left-outline" size={24} color="#47D6FF" />}
          title="Rental Requests"
          subtitle="Get notified about new rental requests"
          showSwitch={true}
          switchValue={settings.rentalRequestNotification !== false}
          onSwitchChange={() => handleToggleSetting('rentalRequestNotification')}
        />
        <SettingItem
          icon={<Ionicons name="time-outline" size={24} color="#47D6FF" />}
          title="Ad Expiry Reminders"
          subtitle="Get reminded before your ad expires"
          showSwitch={true}
          switchValue={settings.adExpiryNotification !== false}
          onSwitchChange={() => handleToggleSetting('adExpiryNotification')}
        />
      </View>

      {/* Communication Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication</Text>
        <SettingItem
          icon={<Ionicons name="chatbubble-outline" size={24} color="#47D6FF" />}
          title="New Messages"
          subtitle="Get notified about new messages"
          showSwitch={true}
          switchValue={settings.messageNotification !== false}
          onSwitchChange={() => handleToggleSetting('messageNotification')}
        />
        <SettingItem
          icon={<Ionicons name="mail-outline" size={24} color="#47D6FF" />}
          title="Email Notifications"
          subtitle="Receive notifications via email"
          showSwitch={true}
          switchValue={settings.emailNotification === true}
          onSwitchChange={() => handleToggleSetting('emailNotification')}
        />
        <SettingItem
          icon={<Ionicons name="chatbubble-outline" size={24} color="#47D6FF" />}
          title="SMS Notifications"
          subtitle="Receive notifications via SMS"
          showSwitch={true}
          switchValue={settings.smsNotification === true}
          onSwitchChange={() => handleToggleSetting('smsNotification')}
        />
      </View>

      {/* Payment Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment & Financial</Text>
        <SettingItem
          icon={<Ionicons name="card-outline" size={24} color="#47D6FF" />}
          title="Payment Received"
          subtitle="Get notified when payments are received"
          showSwitch={true}
          switchValue={settings.paymentNotification !== false}
          onSwitchChange={() => handleToggleSetting('paymentNotification')}
        />
        <SettingItem
          icon={<Ionicons name="wallet-outline" size={24} color="#47D6FF" />}
          title="Payment Reminders"
          subtitle="Get reminded about pending payments"
          showSwitch={true}
          switchValue={settings.paymentReminderNotification === true}
          onSwitchChange={() => handleToggleSetting('paymentReminderNotification')}
        />
      </View>

      {/* Promotional Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Promotional</Text>
        <SettingItem
          icon={<Ionicons name="gift-outline" size={24} color="#47D6FF" />}
          title="Special Offers"
          subtitle="Get notified about special offers and discounts"
          showSwitch={true}
          switchValue={settings.promotionalNotification === true}
          onSwitchChange={() => handleToggleSetting('promotionalNotification')}
        />
        <SettingItem
          icon={<Ionicons name="star-outline" size={24} color="#47D6FF" />}
          title="App Updates"
          subtitle="Get notified about new app features"
          showSwitch={true}
          switchValue={settings.appUpdateNotification !== false}
          onSwitchChange={() => handleToggleSetting('appUpdateNotification')}
        />
      </View>

      {/* Test & Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test & Management</Text>
        <SettingItem
          icon={<Ionicons name="flask-outline" size={24} color="#47D6FF" />}
          title="Test Notification"
          subtitle="Send a test notification"
          onPress={handleTestNotification}
        />
        <SettingItem
          icon={<Ionicons name="trash-outline" size={24} color="#ff4444" />}
          title="Clear All Notifications"
          subtitle="Clear all scheduled notifications"
          onPress={handleClearAllNotifications}
          isDestructive={true}
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
  permissionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  permissionText: {
    marginLeft: 15,
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  permissionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  permissionButton: {
    backgroundColor: '#47D6FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  destructiveItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
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
  destructiveText: {
    color: '#ff4444',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default NotificationSettings;




