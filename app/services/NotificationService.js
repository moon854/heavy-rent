import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.log('Error setting notification handler:', error.message);
}

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    
    // Initialize with error handling
    try {
      console.log('NotificationService initialized');
    } catch (error) {
      console.log('Error initializing NotificationService:', error.message);
    }
  }

  // Register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

    // Check if running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (Platform.OS === 'android') {
      try {
        // Create multiple notification channels for different types
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#47D6FF',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });
        
        // Channel for messages
        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#47D6FF',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });
        
        console.log('✅ Android notification channels created successfully');
      } catch (error) {
        console.log('⚠️ Android notification channel setup:', error.message);
        // Continue even if channel creation fails
      }
    }

    if (Device.isDevice) {
      try {
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
        
        // Skip push token generation in Expo Go to avoid errors
        if (isExpoGo) {
          console.log('✅ Expo Go detected - using local notifications only');
          console.log('📱 Push notifications disabled in Expo Go SDK 53+');
          console.log('💡 For remote push notifications, use EAS development build');
          return null;
        }
        
        // Only try to get push token in development builds (not Expo Go)
        try {
          const projectId = Constants.expoConfig?.projectId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
          console.log('🔑 Using projectId for push token:', projectId);
          
          token = (await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
          })).data;
          console.log('✅ Expo push token obtained:', token);
          this.expoPushToken = token;
        } catch (error) {
          console.error('⚠️ Push token error (normal in Expo Go):', error.message);
          console.log('📱 Using local notifications only - this is expected in Expo Go');
          return null;
        }
      } catch (error) {
        console.error('Error in notification setup:', error);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Send local notification
  async sendLocalNotification(title, body, data = {}, channelId = 'default') {
    try {
      const notificationContent = {
        title: title,
        body: body,
        data: data,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      };
      
      // Add Android-specific channel
      if (Platform.OS === 'android') {
        notificationContent.android = {
          channelId: channelId,
          sound: true,
          priority: 'high',
          vibrate: true,
        };
      }
      
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // Show immediately
      });
      console.log('✅ Local notification sent:', title);
      return true;
    } catch (error) {
      console.log('⚠️ Error sending local notification:', error.message);
      // Continue without throwing error
      return false;
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
      { type: 'new_message', senderName, messagePreview },
      'messages' // Use messages channel
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
    try {
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
    } catch (error) {
      console.log('Notification listeners setup failed:', error.message);
      // Continue without listeners
    }
  }

  // Clean up listeners
  cleanup() {
    try {
      if (this.notificationListener) {
        Notifications.removeNotificationSubscription(this.notificationListener);
      }
      if (this.responseListener) {
        Notifications.removeNotificationSubscription(this.responseListener);
      }
    } catch (error) {
      console.log('Error cleaning up notification listeners:', error.message);
    }
  }

  // Get notification permissions status
  async getNotificationPermissions() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.log('Error getting notification permissions:', error.message);
      return 'denied';
    }
  }

  // Request notification permissions
  async requestNotificationPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status;
    } catch (error) {
      console.log('Error requesting notification permissions:', error.message);
      return 'denied';
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.log('Error canceling all notifications:', error.message);
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log('Error canceling notification:', error.message);
    }
  }

  // Get scheduled notifications
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.log('Error getting scheduled notifications:', error.message);
      return [];
    }
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
      console.log('Error scheduling notification:', error.message);
      return null;
    }
  }
}

// Create singleton instance
let notificationService;
try {
  notificationService = new NotificationService();
} catch (error) {
  console.log('Error creating notification service:', error.message);
  // Create a fallback service
  notificationService = {
    registerForPushNotificationsAsync: async () => null,
    sendLocalNotification: async () => {},
    setupNotificationListeners: () => {},
    cleanup: () => {},
    getNotificationPermissions: async () => 'denied',
    requestNotificationPermissions: async () => 'denied',
    cancelAllNotifications: async () => {},
    cancelNotification: async () => {},
    getScheduledNotifications: async () => [],
    sendScheduledNotification: async () => null
  };
}

export default notificationService;
