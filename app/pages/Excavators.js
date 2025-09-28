import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import Chat from './Chat';
import RentalHistory from './History';
import Home from './Home';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

// Excavators Content Component
const ExcavatorsContent = ({ navigation }) => {
  const goToMachineryDetails = () => {
    navigation.getParent()?.navigate("MachineryDetails");
  }

  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 80, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.getParent()?.navigate("BottomTab")} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Excavators</Text>
      </View>

      {/* Scrollable list */}
      <ScrollView style={{ flex: 1 }}>
        {/* Card 1 */}
        <View style={{
          flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
          justifyContent: 'center', alignItems: 'center', width: '95%', height: 160,
          marginTop: 20, borderRadius: 12, elevation: 5
        }}>
          <TouchableOpacity onPress={goToMachineryDetails}>
            <Image source={require('../../assets/images/ex2.webp')} style={{ width: 162, height: 108, marginRight: 20 }} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rippa R57</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>$250/Day</Text>
            <Text style={{ fontSize: 16 }}>Karachi</Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={{
          flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
          justifyContent: 'center', alignItems: 'center', width: '95%', height: 160,
          marginTop: 20, borderRadius: 12, elevation: 5
        }}>
          <TouchableOpacity>
            <Image source={require('../../assets/images/ex3.webp')} style={{ width: 162, height: 108, marginRight: 20 }} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Mitsubishi</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>$450/Day</Text>
            <Text style={{ fontSize: 16 }}>Lahore</Text>
          </View>
        </View>

        {/* Card 3 */}
        <View style={{
          flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
          justifyContent: 'center', alignItems: 'center', width: '95%', height: 160,
          marginTop: 20, borderRadius: 12, elevation: 5, marginBottom: 20
        }}>
          <TouchableOpacity>
            <Image source={require('../../assets/images/ex4.png')} style={{ width: 162, height: 108, marginRight: 20 }} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Hitachi Exc</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>$300/Day</Text>
            <Text style={{ fontSize: 16 }}>Islamabad</Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

// Main Excavators Component with Bottom Tabs (Home, Chat, History, Profile)
const Excavators = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4e1717ff' }}>
      <Tab.Navigator initialRouteName="ExcavatorsList" screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#47D6FF',
        tabBarInactiveTintColor: 'gray',
      }}>
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="construct" size={24} color={color} /> }} name="ExcavatorsList" component={ExcavatorsContent} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} name="Home" component={Home} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }} name="Chat" component={Chat} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} name="History" component={RentalHistory} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Profile} />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default Excavators
