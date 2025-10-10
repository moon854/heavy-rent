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

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    const { colors, isDark } = useTheme();
    const user = useSelector((state) => state?.home?.user) || {};
    const userId = user?.uid || user?.id;
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        // Listen to unread chat messages (simplified query to avoid index requirement)
        const messagesRef = collection(db, 'chatMessages');
        const q = query(messagesRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let count = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Count messages sent to this user by admin that are unread
                if (data.recipientId === userId && 
                    data.senderType === 'admin' && 
                    data.status !== 'read') {
                    count++;
                }
            });
            setUnreadChatCount(count);
        });

        return () => unsubscribe();
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
                            <View>
                                <Ionicons name="chatbubbles" size={24} color={color} />
                                {unreadChatCount > 0 && (
                                    <View style={{
                                        position: 'absolute',
                                        top: -5,
                                        right: -10,
                                        backgroundColor: '#FF4444',
                                        borderRadius: 10,
                                        minWidth: 20,
                                        height: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 4
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                                            {unreadChatCount > 9 ? '9+' : unreadChatCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ),
                        tabBarBadge: unreadChatCount > 0 ? unreadChatCount : undefined
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