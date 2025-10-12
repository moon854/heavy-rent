import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from '../pages/ChatList';
import RentalHistory from '../pages/History';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import { useTheme } from '../../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import notificationService from '../services/NotificationService';
import appNotificationManager from '../services/AppNotificationManager';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    const { colors, isDark } = useTheme();
    const user = useSelector((state) => state?.home?.user) || {};
    const userId = user?.uid || user?.id;
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [unreadGeneralCount, setUnreadGeneralCount] = useState(0);
    const [unreadMachineryCount, setUnreadMachineryCount] = useState(0);

    // Debug: Log user state on mount and initialize notifications
    useEffect(() => {
        console.log('🔍 BottomTab: User State:', {
            hasUser: !!user,
            uid: user?.uid,
            id: user?.id,
            userId: userId,
            email: user?.email,
            fullUser: user
        });
        
        // Initialize notification system
        const initNotifications = async () => {
            try {
                console.log('🔔 Initializing notification system...');
                await appNotificationManager.initialize();
                console.log('✅ Notification system initialized');
                
                // Test notification after 3 seconds (for debugging)
                setTimeout(async () => {
                    console.log('🧪 Testing notification system...');
                    await appNotificationManager.sendTestNotification();
                    
                // Test chat notification after 5 seconds
                setTimeout(async () => {
                    console.log('💬 Testing chat notification...');
                    await notificationService.notifyNewMessage(
                        'Admin',
                        'This is a test message from admin to verify notifications are working!'
                    );
                }, 2000);
                
                // Manual test function (call this from console)
                window.testChatNotification = async () => {
                    console.log('🧪 Manual test notification triggered');
                    await notificationService.notifyNewMessage(
                        'Test Admin',
                        'Manual test message - if you see this, notifications are working!'
                    );
                };
                
                // Clear all chat counts (call this from console)
                window.clearChatCounts = () => {
                    console.log('🗑️ Clearing all chat counts...');
                    setUnreadChatCount(0);
                    setUnreadGeneralCount(0);
                    setUnreadMachineryCount(0);
                    console.log('✅ All chat counts cleared');
                };
                
                // Clear all chats except machinery owner cards (call this from console)
                window.clearChatsExceptOwnerCards = async () => {
                    try {
                        console.log('🗑️ Clearing all chats except machinery owner cards...');
                        
                        // Import Firebase functions
                        const { collection, query, getDocs, deleteDoc, doc } = await import('firebase/firestore');
                        const { db } = await import('../firebase');
                        
                        // Get all chat messages
                        const messagesRef = collection(db, 'chatMessages');
                        const q = query(messagesRef);
                        const snapshot = await getDocs(q);
                        
                        let deletedCount = 0;
                        let preservedCount = 0;
                        
                        for (const docSnapshot of snapshot.docs) {
                            const data = docSnapshot.data();
                            
                            // Preserve machinery owner cards (rent approval messages)
                            const isOwnerCard = data.type === 'publisher_card' || 
                                               data.chatId?.includes('rent_approved_publisher') ||
                                               data.chatId?.includes('rent_approved_renter');
                            
                            if (isOwnerCard) {
                                preservedCount++;
                                console.log('🔒 Preserving owner card:', docSnapshot.id);
                            } else {
                                await deleteDoc(doc(db, 'chatMessages', docSnapshot.id));
                                deletedCount++;
                                console.log('🗑️ Deleted chat:', docSnapshot.id);
                            }
                        }
                        
                        console.log(`✅ Chat clearing complete:`);
                        console.log(`   Deleted: ${deletedCount} messages`);
                        console.log(`   Preserved: ${preservedCount} owner cards`);
                        
                    } catch (error) {
                        console.error('❌ Error clearing chats:', error);
                    }
                };
                
                }, 3000);
                
            } catch (error) {
                console.log('⚠️ Notification initialization error:', error.message);
            }
        };
        
        initNotifications();
    }, []);

    useEffect(() => {
        if (!userId) {
            console.log('❌ BottomTab: No userId for chat count tracking');
            return;
        }

        console.log('='.repeat(50));
        console.log('👂 BottomTab: Setting up unread chat listener');
        console.log('🆔 Current User ID:', userId);
        console.log('='.repeat(50));

        // Listen to unread chat messages
        const messagesRef = collection(db, 'chatMessages');
        const q = query(messagesRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('🔔 BottomTab: Snapshot received, total messages:', snapshot.size);
            console.log('🔍 Checking messages for userId:', userId);
            
            let totalCount = 0;
            let generalCount = 0;
            let machineryCount = 0;
            const unreadMessages = [];
            const allMessages = [];
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                
                // Log every message for debugging
                allMessages.push({
                    id: doc.id,
                    recipientId: data.recipientId,
                    senderId: data.senderId,
                    status: data.status,
                    message: (data.message || data.text)?.substring(0, 20),
                    senderName: data.senderName,
                    senderType: data.senderType,
                    hasMachineryDetails: !!data.machineryDetails
                });
                
                // Check if message is for this user and unread
                const isForThisUser = data.recipientId === userId;
                const isNotRead = data.status !== 'read'; // 'sent', 'delivered', null, undefined are unread
                const isNotFromThisUser = data.senderId !== userId;
                
                console.log(`📧 Message ${doc.id}:`, {
                    recipientId: data.recipientId,
                    userId: userId,
                    isForThisUser,
                    status: data.status,
                    isNotRead,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    senderType: data.senderType,
                    isNotFromThisUser,
                    hasMachineryDetails: !!data.machineryDetails,
                    shouldCount: isForThisUser && isNotRead && isNotFromThisUser,
                    fullData: data
                });
                
                if (isForThisUser && isNotRead && isNotFromThisUser) {
                    totalCount++;
                    
                    // Separate counts for general vs machinery inquiries
                    if (data.machineryDetails) {
                        machineryCount++;
                    } else {
                        generalCount++;
                    }
                    
                    unreadMessages.push({
                        id: doc.id,
                        sender: data.senderName || data.senderId,
                        text: (data.message || data.text)?.substring(0, 30),
                        status: data.status,
                        senderType: data.senderType,
                        hasMachineryDetails: !!data.machineryDetails
                    });
                }
            });
            
            console.log('📊 SUMMARY:');
            console.log('   Total messages in DB:', snapshot.size);
            console.log('   Total unread count for this user:', totalCount);
            console.log('   General messages unread:', generalCount);
            console.log('   Machinery inquiries unread:', machineryCount);
            console.log('   User ID being checked:', userId);
            if (totalCount > 0) {
                console.log('   Unread messages:', unreadMessages);
            } else {
                console.log('   No unread messages found');
                console.log('   All messages in DB:', allMessages);
            }
            console.log('='.repeat(50));
            
            setUnreadChatCount(totalCount);
            setUnreadGeneralCount(generalCount);
            setUnreadMachineryCount(machineryCount);
        }, (error) => {
            console.error('❌ BottomTab: Error listening to chat messages:', error);
        });

        return () => {
            console.log('🔌 BottomTab: Unsubscribing from chat listener');
            unsubscribe();
        };
    }, [userId]);

    // Listen for new messages and trigger local notifications
    useEffect(() => {
        if (!userId) return;

        console.log('📲 Setting up message notification listener for user:', userId);

        const messagesRef = collection(db, 'chatMessages');
        const q = query(messagesRef);

        // Keep track of messages we've already shown notifications for
        const shownNotifications = new Set();

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('📲 Message notification listener triggered, changes:', snapshot.docChanges().length);
            
            snapshot.docChanges().forEach((change) => {
                console.log('📝 Change type:', change.type, 'Doc ID:', change.doc.id);
                
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const messageId = change.doc.id;
                    
                    console.log('🆕 New message added:', {
                        messageId,
                        recipientId: data.recipientId,
                        userId: userId,
                        senderId: data.senderId,
                        senderName: data.senderName,
                        senderType: data.senderType,
                        status: data.status,
                        message: (data.message || data.text)?.substring(0, 50)
                    });
                    
                    // Check if this is a new message for this user
                    const isForThisUser = data.recipientId === userId;
                    const isNotFromThisUser = data.senderId !== userId;
                    const isUnread = data.status !== 'read'; // 'sent', 'delivered', null, undefined are unread
                    const notAlreadyShown = !shownNotifications.has(messageId);
                    
                    console.log('🔍 Notification check:', {
                        isForThisUser,
                        isNotFromThisUser,
                        isUnread,
                        notAlreadyShown,
                        shouldShow: isForThisUser && isNotFromThisUser && isUnread && notAlreadyShown
                    });
                    
                    if (isForThisUser && isNotFromThisUser && isUnread && notAlreadyShown) {
                        console.log('🔔 New message detected! Showing notification...');
                        console.log('   Sender:', data.senderName || data.senderId);
                        console.log('   Message:', data.message || data.text);
                        
                        // Show local notification
                        notificationService.notifyNewMessage(
                            data.senderName || 'Someone',
                            (data.message || data.text || 'New message')?.substring(0, 100)
                        );
                        
                        // Mark as shown
                        shownNotifications.add(messageId);
                        console.log('✅ Notification shown for message:', messageId);
                    }
                }
            });
        }, (error) => {
            console.error('❌ Error in message notification listener:', error);
        });

        return () => {
            console.log('🔌 Unsubscribing from message notification listener');
            unsubscribe();
        };
    }, [userId]);
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.icon,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
            }}>
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} name="Home" component={Home} />

                <Tab.Screen 
                    options={{ 
                        tabBarIcon: ({ color }) => (
                            <View style={{ position: 'relative' }}>
                                <Ionicons name="chatbubbles" size={24} color={color} />
                                {unreadChatCount > 0 && (
                                    <View style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -12,
                                        backgroundColor: '#FF3B30',
                                        borderRadius: 12,
                                        minWidth: 20,
                                        height: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 5,
                                        borderWidth: 2,
                                        borderColor: colors.card,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 3,
                                        elevation: 5
                                    }}>
                                        <Text style={{ 
                                            color: '#fff', 
                                            fontSize: 11, 
                                            fontWeight: 'bold',
                                            letterSpacing: -0.5
                                        }}>
                                            {unreadChatCount > 99 ? '99+' : unreadChatCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ),
                        tabBarBadge: unreadChatCount > 0 ? (unreadChatCount > 99 ? '99+' : unreadChatCount) : undefined,
                        tabBarBadgeStyle: {
                            backgroundColor: '#FF3B30',
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: 'bold',
                            minWidth: 18,
                            height: 18,
                            borderRadius: 9,
                            marginTop: 2
                        }
                    }} 
                    name="Chats" 
                    component={ChatList} 
                />
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} name="History" component={RentalHistory} />
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Profile} />




            </Tab.Navigator>
        </SafeAreaView>

    );
}