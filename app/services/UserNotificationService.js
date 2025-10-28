import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

class UserNotificationService {
  // Normalize a notification and tag its source collection
  normalizeNotification(raw, source) {
    return {
      id: raw.id,
      __collection: source,
      ...raw,
    };
  }

  // Fetch notifications for a specific user
  async getUserNotifications(userId) {
    try {
      // Primary collection used by some admin pages
      const q1 = query(collection(db, 'notifications'), where('userId', '==', userId));
      // Secondary collection used by chat/admin helpers
      const q2 = query(collection(db, 'userNotifications'), where('userId', '==', userId));

      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const list = [];
      s1.forEach((d) => list.push(this.normalizeNotification({ id: d.id, ...d.data() }, 'notifications')));
      s2.forEach((d) => list.push(this.normalizeNotification({ id: d.id, ...d.data() }, 'userNotifications')));

      // Sort by createdAt desc; fallback to 0
      return list.sort((a, b) => {
        const aTime = a.createdAt?.seconds || a.createdAt?._seconds || 0;
        const bTime = b.createdAt?.seconds || b.createdAt?._seconds || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notification) {
    try {
      const collectionName = notification.__collection || 'notifications';
      await updateDoc(doc(db, collectionName, notification.id), {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const q1 = query(collection(db, 'notifications'), where('userId', '==', userId), where('status', '==', 'unread'));
      const q2 = query(collection(db, 'userNotifications'), where('userId', '==', userId), where('status', '==', 'unread'));

      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const updates = [];
      s1.forEach((d) => updates.push(updateDoc(d.ref, { status: 'read' })));
      s2.forEach((d) => updates.push(updateDoc(d.ref, { status: 'read' })));
      await Promise.all(updates);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Get unread notification count
  async getUnreadCount(userId) {
    try {
      const q1 = query(collection(db, 'notifications'), where('userId', '==', userId), where('status', '==', 'unread'));
      const q2 = query(collection(db, 'userNotifications'), where('userId', '==', userId), where('status', '==', 'unread'));
      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      return (s1?.size || 0) + (s2?.size || 0);
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Listen to real-time notifications
  subscribeToNotifications(userId, callback) {
    try {
      const q1 = query(collection(db, 'notifications'), where('userId', '==', userId));
      const q2 = query(collection(db, 'userNotifications'), where('userId', '==', userId));

      let cache1 = [];
      let cache2 = [];

      const emit = () => {
        const merged = [...cache1, ...cache2];
        const sorted = merged.sort((a, b) => {
          const aTime = a.createdAt?.seconds || a.createdAt?._seconds || 0;
          const bTime = b.createdAt?.seconds || b.createdAt?._seconds || 0;
          return bTime - aTime;
        });
        callback(sorted);
      };

      const unsub1 = onSnapshot(q1, (snap) => {
        const list = [];
        snap.forEach((d) => list.push(this.normalizeNotification({ id: d.id, ...d.data() }, 'notifications')));
        cache1 = list;
        emit();
      });

      const unsub2 = onSnapshot(q2, (snap) => {
        const list = [];
        snap.forEach((d) => list.push(this.normalizeNotification({ id: d.id, ...d.data() }, 'userNotifications')));
        cache2 = list;
        emit();
      });

      return () => {
        try { unsub1 && unsub1(); } catch {}
        try { unsub2 && unsub2(); } catch {}
      };
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  }
}

export default new UserNotificationService();
