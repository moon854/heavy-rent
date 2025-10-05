import notificationService from './NotificationService';

class AppNotificationManager {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize notifications when app starts
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing notification system...');
      
      // Register for push notifications
      const token = await notificationService.registerForPushNotificationsAsync();
      
      if (token) {
        console.log('Push notification token obtained:', token);
        // Here you would typically send the token to your backend server
        // await sendTokenToServer(token);
      }

      // Set up notification listeners
      notificationService.setupNotificationListeners();
      
      this.isInitialized = true;
      console.log('Notification system initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize notification system:', error);
    }
  }

  // Send welcome notification
  async sendWelcomeNotification(userName) {
    await notificationService.sendLocalNotification(
      'Welcome to HeavyRent! 🎉',
      `Hi ${userName}! Start by posting your first ad or browsing available equipment.`,
      { type: 'welcome', userName }
    );
  }

  // Send daily reminder notification
  async sendDailyReminder() {
    await notificationService.sendLocalNotification(
      'Daily Reminder 📅',
      'Check out new equipment listings and manage your ads!',
      { type: 'daily_reminder' }
    );
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
      'Wishing you a wonderful holiday season from the HeavyRent team!',
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
    notificationService.cleanup();
    this.isInitialized = false;
  }
}

// Create singleton instance
const appNotificationManager = new AppNotificationManager();

export default appNotificationManager;



