import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import notificationService from '../services/NotificationService';
import appNotificationManager from '../services/AppNotificationManager';

const NotificationTest = ({ navigation }) => {
  const handleTestAdPosted = () => {
    notificationService.notifyNewAdPosted('Test Excavator', 'Excavators');
  };

  const handleTestAdViewed = () => {
    notificationService.notifyAdViewed('Test Crane', 'John Doe');
  };

  const handleTestNewMessage = () => {
    notificationService.notifyNewMessage('Jane Smith', 'Hi, is this equipment still available?');
  };

  const handleTestRentalRequest = () => {
    notificationService.notifyRentalRequest('Test Bulldozer', 'Mike Johnson');
  };

  const handleTestPaymentReceived = () => {
    notificationService.notifyPaymentReceived('50000', 'Test Excavator');
  };

  const handleTestAdExpiring = () => {
    notificationService.notifyAdExpiring('Test Crane', 3);
  };

  const handleTestMaintenanceReminder = () => {
    notificationService.notifyMaintenanceReminder('Test Excavator', 'Engine Oil Change');
  };

  const handleTestWeatherAlert = () => {
    notificationService.notifyWeatherAlert('Heavy Rain', 'Karachi');
  };

  const handleTestAppUpdate = () => {
    notificationService.notifyAppUpdate('2.0.0', 'New features and bug fixes');
  };

  const handleTestPromotionalOffer = () => {
    notificationService.notifyPromotionalOffer('Summer Special', 20);
  };

  const handleTestSecurityAlert = () => {
    notificationService.notifySecurityAlert('Login Alert', 'New login detected from unknown device');
  };

  const handleTestAccountActivity = () => {
    notificationService.notifyAccountActivity('Profile Update', 'Your profile information has been updated');
  };

  const handleTestWelcome = () => {
    appNotificationManager.sendWelcomeNotification('Test User');
  };

  const handleTestDailyReminder = () => {
    appNotificationManager.sendDailyReminder();
  };

  const handleTestMaintenanceReminderApp = () => {
    appNotificationManager.sendMaintenanceReminder('Test Equipment', 'Monthly Service');
  };

  const handleTestWeatherAlertApp = () => {
    appNotificationManager.sendWeatherAlert('Storm Warning', 'Lahore');
  };

  const handleTestPromotionalApp = () => {
    appNotificationManager.sendPromotionalNotification('Special Offer!', 'Get 30% off on your next rental');
  };

  const handleTestSecurityAlertApp = () => {
    appNotificationManager.sendSecurityAlert('Suspicious activity detected on your account');
  };

  const handleTestAppUpdateApp = () => {
    appNotificationManager.sendAppUpdateNotification('2.1.0', 'Enhanced UI, Better Performance');
  };

  const handleTestRentalReminder = () => {
    appNotificationManager.sendRentalReminder('Test Excavator', 2);
  };

  const handleTestPaymentReminder = () => {
    appNotificationManager.sendPaymentReminder('25000', '2024-01-15');
  };

  const handleTestFeedbackRequest = () => {
    appNotificationManager.sendFeedbackRequest();
  };

  const handleTestFeatureAnnouncement = () => {
    appNotificationManager.sendFeatureAnnouncement('Smart Search', 'Find equipment faster with our new AI-powered search');
  };

  const handleTestMarketplaceUpdate = () => {
    appNotificationManager.sendMarketplaceUpdate('New equipment categories added: Agricultural and Mining');
  };

  const handleTestCommunityUpdate = () => {
    appNotificationManager.sendCommunityUpdate('Join our community forum to connect with other users');
  };

  const handleTestEmergencyAlert = () => {
    appNotificationManager.sendEmergencyAlert('Service temporarily unavailable due to maintenance');
  };

  const handleTestSystemMaintenance = () => {
    appNotificationManager.sendSystemMaintenanceNotification('2:00 AM', '4:00 AM');
  };

  const handleTestHolidayGreeting = () => {
    appNotificationManager.sendHolidayGreeting('Eid Mubarak');
  };

  const handleTestAchievement = () => {
    appNotificationManager.sendAchievementNotification('First Rental', 'You completed your first equipment rental');
  };

  const handleTestReferral = () => {
    appNotificationManager.sendReferralNotification('HEAVY2024');
  };

  const handleTestSeasonalPromotion = () => {
    appNotificationManager.sendSeasonalPromotion('Winter', 'Winter equipment rental at 25% off');
  };

  const TestButton = ({ icon, title, onPress, color = '#47D6FF' }) => (
    <TouchableOpacity style={styles.testButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.testButtonText}>{title}</Text>
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
        <Text style={styles.headerTitle}>Notification Test</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notification Service Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Service Tests</Text>
        <TestButton icon="add-circle-outline" title="Ad Posted" onPress={handleTestAdPosted} />
        <TestButton icon="eye-outline" title="Ad Viewed" onPress={handleTestAdViewed} />
        <TestButton icon="chatbubble-outline" title="New Message" onPress={handleTestNewMessage} />
        <TestButton icon="hand-left-outline" title="Rental Request" onPress={handleTestRentalRequest} />
        <TestButton icon="card-outline" title="Payment Received" onPress={handleTestPaymentReceived} />
        <TestButton icon="time-outline" title="Ad Expiring" onPress={handleTestAdExpiring} />
        <TestButton icon="construct-outline" title="Maintenance Reminder" onPress={handleTestMaintenanceReminder} />
        <TestButton icon="cloudy-outline" title="Weather Alert" onPress={handleTestWeatherAlert} />
        <TestButton icon="rocket-outline" title="App Update" onPress={handleTestAppUpdate} />
        <TestButton icon="gift-outline" title="Promotional Offer" onPress={handleTestPromotionalOffer} />
        <TestButton icon="shield-outline" title="Security Alert" onPress={handleTestSecurityAlert} />
        <TestButton icon="person-outline" title="Account Activity" onPress={handleTestAccountActivity} />
      </View>

      {/* App Notification Manager Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Notification Manager Tests</Text>
        <TestButton icon="hand-right-outline" title="Welcome Message" onPress={handleTestWelcome} />
        <TestButton icon="calendar-outline" title="Daily Reminder" onPress={handleTestDailyReminder} />
        <TestButton icon="construct-outline" title="Maintenance Reminder" onPress={handleTestMaintenanceReminderApp} />
        <TestButton icon="cloudy-outline" title="Weather Alert" onPress={handleTestWeatherAlertApp} />
        <TestButton icon="gift-outline" title="Promotional" onPress={handleTestPromotionalApp} />
        <TestButton icon="shield-outline" title="Security Alert" onPress={handleTestSecurityAlertApp} />
        <TestButton icon="rocket-outline" title="App Update" onPress={handleTestAppUpdateApp} />
        <TestButton icon="time-outline" title="Rental Reminder" onPress={handleTestRentalReminder} />
        <TestButton icon="card-outline" title="Payment Reminder" onPress={handleTestPaymentReminder} />
        <TestButton icon="star-outline" title="Feedback Request" onPress={handleTestFeedbackRequest} />
        <TestButton icon="sparkles-outline" title="Feature Announcement" onPress={handleTestFeatureAnnouncement} />
        <TestButton icon="trending-up-outline" title="Marketplace Update" onPress={handleTestMarketplaceUpdate} />
        <TestButton icon="people-outline" title="Community Update" onPress={handleTestCommunityUpdate} />
        <TestButton icon="warning-outline" title="Emergency Alert" onPress={handleTestEmergencyAlert} color="#ff4444" />
        <TestButton icon="settings-outline" title="System Maintenance" onPress={handleTestSystemMaintenance} />
        <TestButton icon="balloon-outline" title="Holiday Greeting" onPress={handleTestHolidayGreeting} />
        <TestButton icon="trophy-outline" title="Achievement" onPress={handleTestAchievement} />
        <TestButton icon="share-outline" title="Referral" onPress={handleTestReferral} />
        <TestButton icon="leaf-outline" title="Seasonal Promotion" onPress={handleTestSeasonalPromotion} />
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  testButton: {
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
  testButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 15,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default NotificationTest;




