// Admin notification system for new ads
// This will be added to the mobile app's AdForm.js

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

// Function to notify admin about new ad
export const notifyAdminNewAd = async (adData, userId) => {
  try {
    const notificationData = {
      type: 'new_ad',
      title: 'New Ad Posted',
      message: `New ad "${adData.name}" posted by ${adData.ownerName}`,
      adId: adData.id || 'unknown',
      userId: userId,
      adData: {
        name: adData.name,
        price: adData.price,
        ownerName: adData.ownerName,
        ownerPhone: adData.ownerPhone,
        location: adData.location,
        category: adData.categoryName
      },
      status: 'unread',
      createdAt: serverTimestamp(),
      priority: 'high'
    };

    await addDoc(collection(db, 'adminNotifications'), notificationData);
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

// Function to notify user when their ad is approved
export const notifyUserAdApproved = async (userId, adData) => {
  try {
    const notificationData = {
      type: 'ad_approved',
      title: 'Ad Approved! 🎉',
      message: `Your ad "${adData.name}" has been approved and is now live!`,
      userId: userId,
      adId: adData.id,
      adData: {
        name: adData.name,
        price: adData.price,
        category: adData.categoryName
      },
      status: 'unread',
      createdAt: serverTimestamp(),
      priority: 'high'
    };

    await addDoc(collection(db, 'userNotifications'), notificationData);
    console.log('User notification for ad approval sent successfully');
  } catch (error) {
    console.error('Error sending user notification:', error);
  }
};

// Function to notify user when their ad is rejected
export const notifyUserAdRejected = async (userId, adData, reason) => {
  try {
    const notificationData = {
      type: 'ad_rejected',
      title: 'Ad Rejected',
      message: `Your ad "${adData.name}" was rejected. Reason: ${reason || 'Please contact support for details.'}`,
      userId: userId,
      adId: adData.id,
      adData: {
        name: adData.name,
        price: adData.price,
        category: adData.categoryName
      },
      reason: reason,
      status: 'unread',
      createdAt: serverTimestamp(),
      priority: 'medium'
    };

    await addDoc(collection(db, 'userNotifications'), notificationData);
    console.log('User notification for ad rejection sent successfully');
  } catch (error) {
    console.error('Error sending user rejection notification:', error);
  }
};
