import { Image, Text, TouchableOpacity, View, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Chat from './Chat';
import RentalHistory from './History';
import Home from './Home';
import Profile from './Profile';
import { getMachineryByCategory } from '../Helper/firebaseHelper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const Tab = createBottomTabNavigator();

// Excavators Content Component
const ExcavatorsContent = ({ navigation, categoryName, categoryId }) => {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const user = useSelector((state) => state?.home?.user) || {};
  
  // Debug logging
  console.log('ExcavatorsContent received:', { categoryName, categoryId });

  // Check availability for all machinery items
  const checkAvailability = useCallback(async (machineryList) => {
    if (!machineryList || machineryList.length === 0) return {};
    
    try {
      const availability = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get all approved rent requests for these machinery items
      const machineryIds = machineryList.map(m => m.id).filter(Boolean);
      if (machineryIds.length === 0) return {};
      
      const rentRequestsRef = collection(db, 'rentRequests');
      const availabilityPromises = machineryIds.map(async (machineryId) => {
        try {
          const q = query(
            rentRequestsRef,
            where('machineryId', '==', machineryId),
            where('status', '==', 'approved')
          );
          const querySnapshot = await getDocs(q);
          
          let isCurrentlyRented = false;
          let latestEndDate = null;
          
          querySnapshot.forEach((doc) => {
            const request = doc.data();
            if (request.rentalStartDate && request.numberOfDays) {
              const startDate = request.rentalStartDate?.toDate ? request.rentalStartDate.toDate() : new Date(request.rentalStartDate);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + (parseInt(request.numberOfDays) - 1));
              endDate.setHours(23, 59, 59, 999);
              
              // Check if rental is currently active
              if (today >= startDate && today <= endDate) {
                isCurrentlyRented = true;
                // Available date is the day AFTER rental ends
                const nextAvailableDate = new Date(endDate);
                nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
                nextAvailableDate.setHours(0, 0, 0, 0);
                
                if (!latestEndDate || nextAvailableDate > latestEndDate) {
                  latestEndDate = nextAvailableDate;
                }
              }
            }
          });
          
          availability[machineryId] = {
            isAvailable: !isCurrentlyRented,
            availableDate: latestEndDate
          };
        } catch (error) {
          console.error(`Error checking availability for ${machineryId}:`, error);
          availability[machineryId] = { isAvailable: true, availableDate: null };
        }
      });
      
      await Promise.all(availabilityPromises);
      return availability;
    } catch (error) {
      console.error('Error checking availability:', error);
      return {};
    }
  }, []);

  const fetchMachinery = useCallback(async () => {
    try {
      console.log(`Fetching machinery for category: ${categoryId}`);
      const machineryData = await getMachineryByCategory(categoryId);
      console.log(`Received ${machineryData.length} machinery items`);
      setMachinery(machineryData);
      
      // Check availability for all machinery
      const availability = await checkAvailability(machineryData);
      setAvailabilityMap(availability);
    } catch (error) {
      console.error('Error fetching machinery:', error);
    }
  }, [categoryId, checkAvailability]);

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
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMachinery();
    setRefreshing(false);
  };

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
      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#47D6FF" />
        }
      >
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
            <TouchableOpacity 
              key={item.id} 
              onPress={() => goToMachineryDetails(item)}
              style={{
                flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
                justifyContent: 'flex-start', alignItems: 'center', width: '95%', height: 160,
                marginTop: 20, borderRadius: 12, elevation: 5, padding: 10
              }}
            >
              <View style={{ marginRight: 15 }}>
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
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, flex: 1 }}>{item.name}</Text>
                  {availabilityMap[item.id]?.isAvailable === false && (
                    <View style={{
                      backgroundColor: '#FFE0B2',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginLeft: 8
                    }}>
                      <Text style={{ fontSize: 10, color: '#E65100', fontWeight: '600' }}>
                        Not Available
                      </Text>
                    </View>
                  )}
                </View>
                {availabilityMap[item.id]?.isAvailable === false && availabilityMap[item.id]?.availableDate && (
                  <Text style={{ fontSize: 11, color: '#F57C00', marginBottom: 5, fontStyle: 'italic' }}>
                    Available after: {availabilityMap[item.id].availableDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                )}
                {(() => {
                  const isItemOwner = user?.uid === item?.ownerId || user?.id === item?.ownerId;
                  const currentPrice = parseFloat(item?.price || 0);
                  let originalPrice = parseFloat(item?.originalPrice || 0);
                  let commission = parseFloat(item?.commission || 0);
                  
                  // If originalPrice doesn't exist but price exists, calculate breakdown
                  if (isItemOwner && currentPrice > 0 && originalPrice === 0) {
                    const defaultCommissionPercent = 0.20; // 20% default
                    originalPrice = currentPrice / (1 + defaultCommissionPercent);
                    commission = currentPrice - originalPrice;
                  }
                  
                  const hasCommission = originalPrice > 0 && currentPrice > originalPrice;
                  
                  if (isItemOwner && currentPrice > 0 && hasCommission) {
                    return (
                      <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#47D6FF', marginBottom: 3 }}>
                          Rs. {currentPrice.toLocaleString()} (PKR) / {item.priceUnit}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#1976d2', marginBottom: 2 }}>
                          Rent: Rs. {originalPrice.toFixed(0)} + Commission: Rs. {commission.toFixed(0)}
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#47D6FF', marginBottom: 5 }}>
                      Rs. {currentPrice.toLocaleString()} (PKR) / {item.priceUnit}
                    </Text>
                  );
                })()}
                {item.securityDeposit && (
                  <Text style={{ fontSize: 13, color: '#FF9800', fontWeight: '600', marginBottom: 3 }}>
                    Security: Rs. {item.securityDeposit} (PKR)
                  </Text>
                )}
                {(item.ownerName || item.location) && (
                  <Text style={{ fontSize: 12, color: '#999', fontStyle: 'italic', marginBottom: 2 }}>
                    Posted by: {item.ownerName || 'Owner'}{item.location ? `  •  ${item.location}` : ''}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
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
