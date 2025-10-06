import { collection, query, where, orderBy, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

class UserNotificationService {
  // Fetch notifications for a specific user
  async getUserNotifications(userId) {
    try {
      const notificationsRef = collection(db, 'userNotifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const notifications = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by createdAt in descending order (newest first)
      return notifications.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'userNotifications', notificationId), {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const notificationsRef = collection(db, 'userNotifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('status', '==', 'unread')
      );
      
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { status: 'read' })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Get unread notification count
  async getUnreadCount(userId) {
    try {
      const notificationsRef = collection(db, 'userNotifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('status', '==', 'unread')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Listen to real-time notifications
  subscribeToNotifications(userId, callback) {
    try {
      const notificationsRef = collection(db, 'userNotifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId)
      );

      return onSnapshot(q, (querySnapshot) => {
        const notifications = [];
        querySnapshot.forEach((doc) => {
          notifications.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort by createdAt in descending order (newest first)
        const sortedNotifications = notifications.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        
        callback(sortedNotifications);
      });
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  }
}

export default new UserNotificationService();
