import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import UserNotificationService from '../services/UserNotificationService';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state) => state?.home?.user) || {};
  const { colors, isDark } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userId = user.uid || user.id;
      if (!userId) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const userNotifications = await UserNotificationService.getUserNotifications(userId);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read if unread
    if (notification.status === 'unread') {
      await UserNotificationService.markAsRead(notification.id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, status: 'read' } : n
        )
      );
    }

    // Handle different notification types
    switch (notification.type) {
      case 'ad_approved':
        Alert.alert(
          notification.title,
          notification.message,
          [
            { text: 'View My Ads', onPress: () => navigation.navigate('MyAds') },
            { text: 'OK' }
          ]
        );
        break;
      case 'ad_rejected':
        Alert.alert(
          notification.title,
          notification.message,
          [
            { text: 'View My Ads', onPress: () => navigation.navigate('MyAds') },
            { text: 'OK' }
          ]
        );
        break;
      case 'admin_reply':
        // Navigate to chat when admin replies
        if (notification.chatId) {
          navigation.navigate('Chat', { 
            chatType: notification.machineryDetails ? 'ad' : 'general',
            machinery: notification.machineryDetails,
            chatId: notification.chatId
          });
        } else {
          Alert.alert(notification.title, notification.message);
        }
        break;
      default:
        Alert.alert(notification.title, notification.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = user.uid || user.id;
      await UserNotificationService.markAllAsRead(userId);
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'read' }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ad_approved':
        return 'checkmark-circle';
      case 'ad_rejected':
        return 'close-circle';
      case 'new_ad':
        return 'add-circle';
      case 'admin_reply':
        return 'chatbubbles';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type, status) => {
    if (status === 'unread') {
      switch (type) {
        case 'ad_approved':
          return colors.success || '#4CAF50';
        case 'ad_rejected':
          return colors.error || '#F44336';
        default:
          return colors.primary;
      }
    }
    return colors.textSecondary;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>
          Notifications
        </Text>
        {notifications.some(n => n.status === 'unread') && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100
          }}>
            <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={{
              fontSize: 18,
              color: colors.textSecondary,
              marginTop: 16,
              textAlign: 'center'
            }}>
              No notifications yet
            </Text>
            <Text style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginTop: 8,
              textAlign: 'center',
              paddingHorizontal: 20
            }}>
              You'll receive notifications about your ads and account updates here
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              style={{
                backgroundColor: colors.card,
                marginHorizontal: 15,
                marginVertical: 5,
                borderRadius: 10,
                padding: 15,
                borderLeftWidth: 4,
                borderLeftColor: getNotificationColor(notification.type, notification.status),
                opacity: notification.status === 'read' ? 0.7 : 1
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={24}
                  color={getNotificationColor(notification.type, notification.status)}
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: notification.status === 'unread' ? 'bold' : 'normal',
                    color: colors.textPrimary,
                    marginBottom: 4
                  }}>
                    {notification.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                    marginBottom: 8
                  }}>
                    {notification.message}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    {formatDate(notification.createdAt)}
                  </Text>
                </View>
                {notification.status === 'unread' && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.primary,
                    marginTop: 8
                  }} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Notifications;
