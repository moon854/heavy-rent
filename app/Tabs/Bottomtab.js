import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SafeAreaView } from 'react-native';
import ChatList from '../pages/ChatList';
import RentalHistory from '../pages/History';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import { useTheme } from '../../contexts/ThemeContext';





const Tab = createBottomTabNavigator();

export default function BottomTab() {
    const { colors, isDark } = useTheme();
    
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

                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }} name="Chats" component={ChatList} />
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} name="History" component={RentalHistory} />
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Profile} />




            </Tab.Navigator>
        </SafeAreaView>

    );
}