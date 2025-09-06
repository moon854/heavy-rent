import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../pages/Home';
import Chat from '../pages/Chat';



const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (

        <Tab.Navigator>
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="Home" size={24} color={color} /> }} name="Home" component={Home} />

             <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="Home" size={24} color={color} /> }} name="Chat" component={Chat} />

           

             

               {/* <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} name="Categories" component={Categories} /> */}


        </Tab.Navigator>

    );
}