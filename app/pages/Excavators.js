import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Chat from './Chat';
import RentalHistory from './History';
import Home from './Home';
import Profile from './Profile';
import { getMachineryByCategory } from '../Helper/firebaseHelper';

const Tab = createBottomTabNavigator();

// Excavators Content Component
const ExcavatorsContent = ({ navigation, categoryName, categoryId }) => {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Debug logging
  console.log('ExcavatorsContent received:', { categoryName, categoryId });

  const fetchMachinery = useCallback(async () => {
    try {
      console.log(`Fetching machinery for category: ${categoryId}`);
      const machineryData = await getMachineryByCategory(categoryId);
      console.log(`Received ${machineryData.length} machinery items`);
      setMachinery(machineryData);
    } catch (error) {
      console.error('Error fetching machinery:', error);
    }
  }, [categoryId]);

  useEffect(() => {
    console.log('Initial fetch for category:', categoryId);
    setLoading(true);
    fetchMachinery().finally(() => {
      console.log('Loading completed for category:', categoryId);
      setLoading(false);
    });
  }, [fetchMachinery]);

  // Refresh when screen comes into focus (e.g., returning from AdForm)
  useFocusEffect(
    useCallback(() => {
      console.log('Category page focused, refreshing machinery list...');
      if (!loading) { // Only refresh if not already loading
        fetchMachinery().finally(() => {
          console.log('Focus refresh completed for category:', categoryId);
          setLoading(false);
        });
      }
    }, [fetchMachinery, loading, categoryId])
  );

  const goToMachineryDetails = (machineryItem) => {
    navigation.getParent()?.navigate("MachineryDetails", { machinery: machineryItem });
  }

  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 80, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.getParent()?.navigate("BottomTab")} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{categoryName}</Text>
      </View>

      {/* Scrollable list */}
      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text>Loading machinery...</Text>
          </View>
        ) : machinery.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>No machinery available in this category</Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 10 }}>Be the first to post an ad!</Text>
          </View>
        ) : (
          machinery.map((item) => (
            <View key={item.id} style={{
              flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
              justifyContent: 'flex-start', alignItems: 'center', width: '95%', height: 160,
              marginTop: 20, borderRadius: 12, elevation: 5, padding: 10
            }}>
              <TouchableOpacity onPress={() => goToMachineryDetails(item)} style={{ marginRight: 15 }}>
                {console.log('Rendering image for:', item.name, 'Image URL:', item.imageUrl, 'ImageUrls:', item.imageUrls)}
                {(item.imageUrl || (item.imageUrls && item.imageUrls.length > 0)) ? (
                  <Image 
                    source={{ uri: item.imageUrl || item.imageUrls[0] }} 
                    style={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: 8,
                      resizeMode: 'cover'
                    }} 
                    onError={(error) => {
                      console.error('Image failed to load for item:', item.name, 'URL:', item.imageUrl || item.imageUrls[0], 'Error:', error);
                      console.error('Full item data:', item);
                    }}
                    onLoad={() => console.log('Image loaded successfully for:', item.name, 'URL:', item.imageUrl || item.imageUrls[0])}
                  />
                ) : (
                  <View style={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: 8,
                    backgroundColor: '#f0f0f0',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 12, color: '#999' }}>No Image</Text>
                    <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                      {item.imageUrl ? 'URL exists' : 'No URL'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>{item.name}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#47D6FF', marginBottom: 5 }}>${item.price}/{item.priceUnit}</Text>
                {item.securityDeposit && (
                  <Text style={{ fontSize: 13, color: '#FF9800', fontWeight: '600', marginBottom: 3 }}>
                    Security: Rs. {item.securityDeposit}
                  </Text>
                )}
                {item.ownerName && (
                  <Text style={{ fontSize: 12, color: '#999', fontStyle: 'italic', marginBottom: 2 }}>
                    Posted by: {item.ownerName}
                  </Text>
                )}
                {item.location && (
                  <Text style={{ fontSize: 11, color: '#bbb' }}>
                    📍 {item.location}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  )
}

// Main Excavators Component with Bottom Tabs (Home, Chat, History, Profile)
const Excavators = ({ navigation, route }) => {
  const categoryName = route?.params?.categoryName || 'Excavators';
  const categoryId = route?.params?.categoryId || 'excavators';
  
  // Debug logging
  console.log('Excavators component received route params:', route?.params);
  console.log('Category name:', categoryName, 'Category ID:', categoryId);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4e1717ff' }}>
      <Tab.Navigator initialRouteName="CategoryContent" screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#47D6FF',
        tabBarInactiveTintColor: 'gray',
      }}>
        <Tab.Screen 
          options={{ tabBarIcon: ({ color }) => <Ionicons name="construct" size={24} color={color} /> }} 
          name="CategoryContent" 
        >
          {(props) => <ExcavatorsContent {...props} categoryName={categoryName} categoryId={categoryId} />}
        </Tab.Screen>
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} name="Home" component={Home} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }} name="Chat" component={Chat} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} name="History" component={RentalHistory} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Profile} />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default Excavators
