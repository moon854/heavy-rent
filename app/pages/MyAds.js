import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getAllData, deleteData } from '../Helper/firebaseHelper';
import notificationService from '../services/NotificationService';

const MyAds = ({ navigation }) => {
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.home.user);

  const fetchMyAds = useCallback(async () => {
    try {
      console.log('Fetching ads for user:', user?.uid);
      const allMachinery = await getAllData('machinery');
      
      console.log('All machinery data:', allMachinery);
      console.log('Current user UID:', user?.uid);
      
      // Filter ads by current user's UID (check both userId and ownerId fields)
      const userAds = allMachinery.filter(ad => {
        const isUserAd = ad.userId === user?.uid || ad.ownerId === user?.uid;
        console.log(`Ad "${ad.name}": userId=${ad.userId}, ownerId=${ad.ownerId}, isUserAd=${isUserAd}`);
        return isUserAd;
      });
      
      console.log(`Found ${userAds.length} ads for user:`, userAds);
      setMyAds(userAds);
    } catch (error) {
      console.error('Error fetching my ads:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchMyAds();
  }, [fetchMyAds]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('My Ads page focused, refreshing ads list...');
      if (!loading) {
        fetchMyAds().finally(() => {
          console.log('Focus refresh completed for My Ads');
          setLoading(false);
        });
      }
    }, [fetchMyAds, loading])
  );

  const goToMachineryDetails = (ad) => {
    navigation.navigate("MachineryDetails", { machinery: ad });
  };

  const handleDeleteAd = (ad) => {
    Alert.alert(
      "Delete Ad",
      `Are you sure you want to delete "${ad.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAd(ad)
        }
      ]
    );
  };

  const deleteAd = async (ad) => {
    try {
      console.log('Deleting ad with ID:', ad.id);
      await deleteData('machinery', ad.id);
      console.log('Ad deleted successfully');
      
      // Send notification
      notificationService.sendLocalNotification(
        'Ad Deleted Successfully 🗑️',
        `Your "${ad.name}" ad has been permanently deleted`,
        { type: 'ad_deleted', adName: ad.name }
      );
      
      // Refresh the ads list
      await fetchMyAds();
      
      Alert.alert("Success", "Ad deleted successfully!");
    } catch (error) {
      console.error('Error deleting ad:', error);
      Alert.alert("Error", "Failed to delete ad. Please try again.");
    }
  };

  const handleEditAd = (ad) => {
    // Navigate to AdForm with the ad data for editing
    navigation.navigate("AdForm", { 
      editMode: true, 
      adData: ad 
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 80, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>My Ads</Text>
      </View>


      {/* My Ads List */}
      <View style={{ paddingHorizontal: 20 }}>
        {loading ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Loading your ads...</Text>
          </View>
        ) : myAds.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Ionicons name="document-outline" size={60} color="#ccc" />
            <Text style={{ fontSize: 18, color: '#666', marginTop: 15, textAlign: 'center' }}>
              No ads posted yet
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 5, textAlign: 'center' }}>
              Start by posting your first ad!
            </Text>
          </View>
        ) : (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
              Your Posted Ads ({myAds.length})
            </Text>
            {myAds.map((ad) => (
              <View
                key={ad.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  marginBottom: 15,
                  padding: 15,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                {/* Main Ad Content */}
                <TouchableOpacity 
                  onPress={() => goToMachineryDetails(ad)}
                  style={{ flexDirection: 'row' }}
                >
                  {/* Ad Image */}
                  <View style={{ marginRight: 15 }}>
                    {(ad.imageUrl || (ad.imageUrls && ad.imageUrls.length > 0)) ? (
                      <Image 
                        source={{ uri: ad.imageUrl || ad.imageUrls[0] }} 
                        style={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: 8,
                          resizeMode: 'cover'
                        }} 
                        onError={(error) => console.error('Image failed to load for ad:', ad.name, error)}
                        onLoad={() => console.log('Image loaded successfully for ad:', ad.name)}
                      />
                    ) : (
                      <View style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 8,
                        backgroundColor: '#f0f0f0',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                      </View>
                    )}
                  </View>

                  {/* Ad Details */}
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                        {ad.name || 'Untitled Ad'}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666', marginBottom: 3 }}>
                        Category: {ad.categoryName || ad.category || 'Unknown'}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666', marginBottom: 3 }}>
                        Price: Rs {ad.rentPerDay || ad.price || '0'} / day
                      </Text>
                      {ad.securityDeposit && (
                        <Text style={{ fontSize: 13, color: '#FF9800', fontWeight: '600', marginBottom: 3 }}>
                          Security: Rs. {ad.securityDeposit}
                        </Text>
                      )}
                      {/* Status Indicator */}
                      <View style={{ 
                        alignSelf: 'flex-start',
                        backgroundColor: ad.status === 'approved' ? '#4CAF50' : 
                                        ad.status === 'rejected' ? '#F44336' : '#FF9800',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginBottom: 3
                      }}>
                        <Text style={{ 
                          fontSize: 12, 
                          color: '#fff', 
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {ad.status === 'approved' ? '✅ Live' : 
                           ad.status === 'rejected' ? '❌ Rejected' : '⏳ Under Review'}
                        </Text>
                      </View>
                      {ad.location && (
                        <Text style={{ fontSize: 12, color: '#999' }}>
                          📍 {ad.location}
                        </Text>
                      )}
                    </View>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      <Text style={{ fontSize: 12, color: '#47D6FF', fontWeight: '600' }}>
                        Posted: {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'Unknown'}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#47D6FF" />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-around', 
                  marginTop: 15,
                  paddingTop: 15,
                  borderTopWidth: 1,
                  borderTopColor: '#f0f0f0'
                }}>
                  {ad.status === 'pending' ? (
                    // Show only Edit and Delete for pending ads
                    <>
                      <TouchableOpacity 
                        onPress={() => handleEditAd(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#47D6FF',
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginRight: 10,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 14, fontWeight: '600' }}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleDeleteAd(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#F44336',
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginLeft: 10,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 14, fontWeight: '600' }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : ad.status === 'approved' ? (
                    // Show View Live, Edit and Delete for approved ads
                    <>
                      <TouchableOpacity 
                        onPress={() => goToMachineryDetails(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#4CAF50',
                          paddingHorizontal: 15,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginRight: 5,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="eye-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 12, fontWeight: '600' }}>
                          View Live
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleEditAd(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#47D6FF',
                          paddingHorizontal: 15,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginHorizontal: 5,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 12, fontWeight: '600' }}>
                          Edit Ad
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleDeleteAd(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#F44336',
                          paddingHorizontal: 15,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginLeft: 5,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 12, fontWeight: '600' }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    // Show Edit and Delete for rejected ads
                    <>
                      <TouchableOpacity 
                        onPress={() => handleEditAd(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#47D6FF',
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginRight: 10,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 14, fontWeight: '600' }}>
                          Edit & Resubmit
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleDeleteAd(ad)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#F44336',
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 20,
                          flex: 1,
                          marginLeft: 10,
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 5, fontSize: 14, fontWeight: '600' }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MyAds;
