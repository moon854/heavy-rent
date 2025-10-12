import notificationService from './NotificationService';

class AppNotificationManager {
  constructor() {
    this.isInitialized = false;
    
    // Initialize with error handling
    try {
      console.log('AppNotificationManager initialized');
    } catch (error) {
      console.log('Error initializing AppNotificationManager:', error.message);
    }
  }

  // Initialize notifications when app starts
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔔 Initializing notification system...');
      
      // Register for push notifications (will return null in Expo Go)
      const token = await notificationService.registerForPushNotificationsAsync();
      
      if (token) {
        console.log('✅ Push notification token obtained:', token);
        // Here you would typically send the token to your backend server
        // await sendTokenToServer(token);
      } else {
        console.log('📱 Using local notifications only (normal in Expo Go)');
      }

      // Set up notification listeners (always works)
      try {
        notificationService.setupNotificationListeners();
        console.log('✅ Notification listeners setup successfully');
      } catch (listenerError) {
        console.log('⚠️ Notification listeners setup failed:', listenerError.message);
        // Continue without listeners
      }
      
      this.isInitialized = true;
      console.log('✅ Notification system initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize notification system:', error);
      // Continue with local notifications even if push notifications fail
      this.isInitialized = true;
    }
  }

  // Send test notification (for debugging)
  async sendTestNotification() {
    try {
      console.log('🧪 Sending test notification...');
      await notificationService.sendLocalNotification(
        'Test Notification 📱',
        'This is a test notification to verify the system is working!',
        { type: 'test' },
        'default'
      );
      console.log('✅ Test notification sent successfully');
      return true;
    } catch (error) {
      console.log('❌ Error sending test notification:', error.message);
      return false;
    }
  }

  // Send welcome notification
  async sendWelcomeNotification(userName) {
    try {
      await notificationService.sendLocalNotification(
        'Welcome to Rent-To-Build! 🎉',
        `Hi ${userName}! Start by posting your first ad or browsing available equipment.`,
        { type: 'welcome', userName }
      );
    } catch (error) {
      console.log('Error sending welcome notification:', error.message);
    }
  }

  // Send daily reminder notification
  async sendDailyReminder() {
    try {
      await notificationService.sendLocalNotification(
        'Daily Reminder 📅',
        'Check out new equipment listings and manage your ads!',
        { type: 'daily_reminder' }
      );
    } catch (error) {
      console.log('Error sending daily reminder:', error.message);
    }
  }

  // Send maintenance reminder
  async sendMaintenanceReminder(equipmentName, maintenanceType) {
    await notificationService.sendLocalNotification(
      'Maintenance Reminder 🔧',
      `Time for ${maintenanceType} maintenance on ${equipmentName}`,
      { type: 'maintenance', equipmentName, maintenanceType }
    );
  }

  // Send weather alert
  async sendWeatherAlert(condition, location) {
    await notificationService.sendLocalNotification(
      'Weather Alert ⛈️',
      `${condition} expected in ${location}. Secure your equipment!`,
      { type: 'weather', condition, location }
    );
  }

  // Send promotional notification
  async sendPromotionalNotification(title, message) {
    await notificationService.sendLocalNotification(
      title,
      message,
      { type: 'promotional', title, message }
    );
  }

  // Send security alert
  async sendSecurityAlert(message) {
    await notificationService.sendLocalNotification(
      'Security Alert 🔒',
      message,
      { type: 'security', message }
    );
  }

  // Send app update notification
  async sendAppUpdateNotification(version, features) {
    await notificationService.sendLocalNotification(
      'App Update Available! 🚀',
      `Version ${version} is available with: ${features}`,
      { type: 'app_update', version, features }
    );
  }

  // Send rental reminder
  async sendRentalReminder(equipmentName, daysLeft) {
    await notificationService.sendLocalNotification(
      'Rental Reminder ⏰',
      `Your ${equipmentName} rental expires in ${daysLeft} days`,
      { type: 'rental_reminder', equipmentName, daysLeft }
    );
  }

  // Send payment reminder
  async sendPaymentReminder(amount, dueDate) {
    await notificationService.sendLocalNotification(
      'Payment Reminder 💰',
      `Payment of Rs ${amount} is due on ${dueDate}`,
      { type: 'payment_reminder', amount, dueDate }
    );
  }

  // Send feedback request
  async sendFeedbackRequest() {
    await notificationService.sendLocalNotification(
      'How was your experience? ⭐',
      'Rate your recent rental experience and help us improve!',
      { type: 'feedback_request' }
    );
  }

  // Send new feature announcement
  async sendFeatureAnnouncement(featureName, description) {
    await notificationService.sendLocalNotification(
      'New Feature Available! ✨',
      `${featureName}: ${description}`,
      { type: 'feature_announcement', featureName, description }
    );
  }

  // Send marketplace update
  async sendMarketplaceUpdate(message) {
    await notificationService.sendLocalNotification(
      'Marketplace Update 📈',
      message,
      { type: 'marketplace_update', message }
    );
  }

  // Send community update
  async sendCommunityUpdate(message) {
    await notificationService.sendLocalNotification(
      'Community Update 👥',
      message,
      { type: 'community_update', message }
    );
  }

  // Send emergency alert
  async sendEmergencyAlert(message) {
    await notificationService.sendLocalNotification(
      'Emergency Alert 🚨',
      message,
      { type: 'emergency', message }
    );
  }

  // Send system maintenance notification
  async sendSystemMaintenanceNotification(startTime, endTime) {
    await notificationService.sendLocalNotification(
      'System Maintenance 🔧',
      `Scheduled maintenance from ${startTime} to ${endTime}. Some features may be unavailable.`,
      { type: 'system_maintenance', startTime, endTime }
    );
  }

  // Send holiday greeting
  async sendHolidayGreeting(holidayName) {
    await notificationService.sendLocalNotification(
      `Happy ${holidayName}! 🎊`,
      'Wishing you a wonderful holiday season from the Rent-To-Build team!',
      { type: 'holiday_greeting', holidayName }
    );
  }

  // Send achievement notification
  async sendAchievementNotification(achievementName, description) {
    await notificationService.sendLocalNotification(
      'Achievement Unlocked! 🏆',
      `${achievementName}: ${description}`,
      { type: 'achievement', achievementName, description }
    );
  }

  // Send referral notification
  async sendReferralNotification(referralCode) {
    await notificationService.sendLocalNotification(
      'Referral Program 🎁',
      `Share your referral code ${referralCode} and earn rewards!`,
      { type: 'referral', referralCode }
    );
  }

  // Send seasonal promotion
  async sendSeasonalPromotion(season, offer) {
    await notificationService.sendLocalNotification(
      `${season} Special Offer! 🌟`,
      offer,
      { type: 'seasonal_promotion', season, offer }
    );
  }

  // Clean up
  cleanup() {
    try {
      notificationService.cleanup();
      this.isInitialized = false;
    } catch (error) {
      console.log('Error cleaning up app notification manager:', error.message);
    }
  }
}

// Create singleton instance
let appNotificationManager;
try {
  appNotificationManager = new AppNotificationManager();
} catch (error) {
  console.log('Error creating app notification manager:', error.message);
  // Create a fallback manager
  appNotificationManager = {
    initialize: async () => {},
    sendWelcomeNotification: async () => {},
    sendDailyReminder: async () => {},
    sendMaintenanceReminder: async () => {},
    sendWeatherAlert: async () => {},
    sendPromotionalNotification: async () => {},
    sendSecurityAlert: async () => {},
    sendAppUpdateNotification: async () => {},
    sendRentalReminder: async () => {},
    sendPaymentReminder: async () => {},
    sendFeedbackRequest: async () => {},
    sendFeatureAnnouncement: async () => {},
    sendMarketplaceUpdate: async () => {},
    sendCommunityUpdate: async () => {},
    sendEmergencyAlert: async () => {},
    sendSystemMaintenanceNotification: async () => {},
    sendHolidayGreeting: async () => {},
    sendAchievementNotification: async () => {},
    sendReferralNotification: async () => {},
    sendSeasonalPromotion: async () => {},
    cleanup: () => {}
  };
}

export default appNotificationManager;




