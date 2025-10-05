import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#47D6FF',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId || 'heavyrent-app-2024';
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        })).data;
        console.log('Expo push token:', token);
        this.expoPushToken = token;
      } catch (error) {
        console.error('Error getting push token:', error);
        console.log('Push notifications will work locally but may not work for remote notifications without proper EAS setup');
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Send local notification
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
      console.log('Local notification sent:', title);
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Send notification for new ad posted
  async notifyNewAdPosted(adName, category) {
    await this.sendLocalNotification(
      'Ad Posted Successfully! 🎉',
      `Your "${adName}" ad has been posted in ${category} category`,
      { type: 'ad_posted', adName, category }
    );
  }

  // Send notification for ad viewed
  async notifyAdViewed(adName, viewerName) {
    await this.sendLocalNotification(
      'Someone Viewed Your Ad 👀',
      `${viewerName} viewed your "${adName}" ad`,
      { type: 'ad_viewed', adName, viewerName }
    );
  }

  // Send notification for new message
  async notifyNewMessage(senderName, messagePreview) {
    await this.sendLocalNotification(
      `New Message from ${senderName} 💬`,
      messagePreview,
      { type: 'new_message', senderName, messagePreview }
    );
  }

  // Send notification for rental request
  async notifyRentalRequest(adName, requesterName) {
    await this.sendLocalNotification(
      'New Rental Request 📋',
      `${requesterName} wants to rent your "${adName}"`,
      { type: 'rental_request', adName, requesterName }
    );
  }

  // Send notification for payment received
  async notifyPaymentReceived(amount, adName) {
    await this.sendLocalNotification(
      'Payment Received! 💰',
      `You received Rs ${amount} for "${adName}"`,
      { type: 'payment_received', amount, adName }
    );
  }

  // Send notification for ad expiring
  async notifyAdExpiring(adName, daysLeft) {
    await this.sendLocalNotification(
      'Ad Expiring Soon ⏰',
      `Your "${adName}" ad expires in ${daysLeft} days`,
      { type: 'ad_expiring', adName, daysLeft }
    );
  }

  // Send notification for maintenance reminder
  async notifyMaintenanceReminder(adName, maintenanceType) {
    await this.sendLocalNotification(
      'Maintenance Reminder 🔧',
      `Time for ${maintenanceType} maintenance on "${adName}"`,
      { type: 'maintenance_reminder', adName, maintenanceType }
    );
  }

  // Send notification for weather alert
  async notifyWeatherAlert(weatherCondition, location) {
    await this.sendLocalNotification(
      'Weather Alert ⛈️',
      `${weatherCondition} expected in ${location}. Check your equipment.`,
      { type: 'weather_alert', weatherCondition, location }
    );
  }

  // Send notification for app updates
  async notifyAppUpdate(version, features) {
    await this.sendLocalNotification(
      'App Update Available! 🚀',
      `Version ${version} is available with new features: ${features}`,
      { type: 'app_update', version, features }
    );
  }

  // Send notification for promotional offers
  async notifyPromotionalOffer(offerTitle, discount) {
    await this.sendLocalNotification(
      'Special Offer! 🎁',
      `${offerTitle} - Get ${discount}% off on your next rental`,
      { type: 'promotional_offer', offerTitle, discount }
    );
  }

  // Send notification for security alert
  async notifySecurityAlert(alertType, message) {
    await this.sendLocalNotification(
      'Security Alert! 🔒',
      message,
      { type: 'security_alert', alertType, message }
    );
  }

  // Send notification for account activity
  async notifyAccountActivity(activityType, details) {
    await this.sendLocalNotification(
      'Account Activity 📱',
      details,
      { type: 'account_activity', activityType, details }
    );
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Handle notification received while app is open
    });

    // Listener for user interactions with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      
      // Handle different notification types
      switch (data.type) {
        case 'ad_posted':
          // Navigate to My Ads page
          break;
        case 'ad_viewed':
          // Navigate to ad details
          break;
        case 'new_message':
          // Navigate to chat
          break;
        case 'rental_request':
          // Navigate to rental requests
          break;
        case 'payment_received':
          // Navigate to payment history
          break;
        default:
          // Navigate to home
          break;
      }
    });
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get notification permissions status
  async getNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  // Request notification permissions
  async requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Get scheduled notifications
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Send scheduled notification
  async sendScheduledNotification(title, body, triggerDate, data = {}) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: 'default',
        },
        trigger: triggerDate,
      });
      console.log('Scheduled notification:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
