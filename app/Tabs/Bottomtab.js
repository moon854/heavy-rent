import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SafeAreaView } from 'react-native';
import Chat from '../pages/Chat';
import RentalHistory from '../pages/History';
import Home from '../pages/Home';
import Profile from '../pages/Profile';





const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4e1717ff' }}>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#47D6FF',
                tabBarInactiveTintColor: 'gray',
            }}>
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} name="Home" component={Home} />

                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }} name="Chat" component={Chat} />
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} name="History" component={RentalHistory} />
                <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Profile} />




            </Tab.Navigator>
        </SafeAreaView>

    );
}