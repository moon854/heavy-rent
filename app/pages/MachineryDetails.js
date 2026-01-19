import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View, Modal, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { deleteData, getDataById } from '../Helper/firebaseHelper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const MachineryDetails = ({ navigation, route }) => {
  const { machinery } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const user = useSelector((state) => state?.home?.user) || {};
  const settings = useSelector((state) => state?.home?.settings) || {};
  const [ownerAllowsLocation, setOwnerAllowsLocation] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableDate, setAvailableDate] = useState(null);
  
  // Debug user data
  console.log('Current user data:', {
    uid: user?.uid,
    id: user?.id,
    email: user?.email,
    firstName: user?.firstName
  });
  
  // Check if current user is the owner of this ad
  const isOwner = user?.uid === machinery?.ownerId || user?.id === machinery?.ownerId;
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Debug logging
  console.log('MachineryDetails received machinery:', {
    name: machinery?.name,
    imageUrl: machinery?.imageUrl,
    imageUrls: machinery?.imageUrls,
    hasImageUrls: !!machinery?.imageUrls,
    imageUrlsLength: machinery?.imageUrls?.length,
    fullMachineryData: machinery
  });
  
  // Debug owner check
  console.log('Owner check debug:', {
    userUid: user?.uid,
    userId: user?.id,
    machineryOwnerId: machinery?.ownerId,
    isOwner: isOwner
  });

  // Check if machinery is currently rented
  useEffect(() => {
    const checkAvailability = async () => {
      if (!machinery?.id) return;
      
      try {
        const rentRequestsRef = collection(db, 'rentRequests');
        const q = query(
          rentRequestsRef,
          where('machineryId', '==', machinery.id),
          where('status', '==', 'approved')
        );
        
        const querySnapshot = await getDocs(q);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let latestEndDate = null;
        let isCurrentlyRented = false;
        
        querySnapshot.forEach((doc) => {
          const request = doc.data();
          if (request.rentalStartDate && request.numberOfDays) {
            const startDate = request.rentalStartDate?.toDate ? request.rentalStartDate.toDate() : new Date(request.rentalStartDate);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + (parseInt(request.numberOfDays) - 1));
            endDate.setHours(23, 59, 59, 999);
            
            // Check if rental is currently active (today is between start and end date)
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
        
        setIsAvailable(!isCurrentlyRented);
        setAvailableDate(latestEndDate);
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsAvailable(true); // Default to available on error
      }
    };
    
    checkAvailability();
  }, [machinery?.id]);

  // Additional debugging for image display
  console.log('Image display check:', {
    hasImageUrl: !!machinery?.imageUrl,
    hasImageUrls: !!machinery?.imageUrls,
    imageUrlValid: machinery?.imageUrl?.startsWith('http'),
    imageUrlsValid: machinery?.imageUrls?.every(url => url?.startsWith('http')),
    willShowGallery: machinery?.imageUrls && machinery.imageUrls.length > 1,
    willShowSingle: !(machinery?.imageUrls && machinery.imageUrls.length > 1)
  });
  
  const goToRForm = () => {
    navigation.navigate("RenterForm", { machineryData: machinery });
  };

  const goToChat = () => {
    navigation.navigate("Chat", { 
      chatType: 'ad',
      machinery: machinery 
    });
  };

  const goToOwnerProfile = () => {
    navigation.navigate("OwnerProfile", {
      ownerId: machinery?.ownerId,
      ownerName: machinery?.ownerName || 'Owner'
    });
  };

  // Load owner's privacy for location visibility
  useEffect(() => {
    let isActive = true;
    const loadOwnerPref = async () => {
      try {
        if (!machinery?.ownerId) return;
        const owner = await getDataById('users', machinery.ownerId);
        if (!isActive) return;
        const allow = owner?.settings?.showLocation !== false;
        setOwnerAllowsLocation(allow);
      } catch (e) {
        // Default to showing to avoid hiding by error
        setOwnerAllowsLocation(true);
      }
    };
    loadOwnerPref();
    return () => { isActive = false; };
  }, [machinery?.ownerId]);

  const handleEditAd = () => {
    navigation.navigate("AdForm", { 
      editMode: true, 
      adData: machinery 
    });
  };

  const handleDeleteAd = () => {
    Alert.alert(
      'Delete Ad',
      'Are you sure you want to delete this ad? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteData('machinery', machinery.id);
              Alert.alert('Success', 'Ad deleted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete ad. Please try again.');
            }
          },
        },
      ]
    );
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with back button */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate("BottomTab")} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Machinery Details</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, flex: 1, textAlign: 'center' }}>
            {machinery?.name || 'Machinery Name'}
          </Text>
        </View>

        {/* Availability Status */}
        {!isAvailable && availableDate && (
          <View style={{
            backgroundColor: '#FFE0B2',
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            borderLeftWidth: 4,
            borderLeftColor: '#FF9800'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Ionicons name="close-circle" size={20} color="#F57C00" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#E65100', marginLeft: 8 }}>
                Machinery Not Available
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#666', marginLeft: 28 }}>
              Available after: {availableDate ? availableDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </Text>
          </View>
        )}

        {/* Image Gallery */}
        <View style={{ marginBottom: 20 }}>
          {console.log('Checking imageUrls:', machinery?.imageUrls, 'Length:', machinery?.imageUrls?.length, 'imageUrl:', machinery?.imageUrl)}
          {(machinery?.imageUrls && machinery.imageUrls.length > 1) ? (
            <>
              {console.log('Using gallery mode - multiple images')}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                style={{ marginBottom: 10 }}
              >
                {machinery.imageUrls.map((imageUrl, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openImageModal(imageUrl)}
                  >
                    {console.log('Rendering gallery image:', imageUrl)}
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ 
                        width: 300, 
                        height: 200, 
                        borderRadius: 12,
                        resizeMode: 'cover',
                        marginRight: 10
                      }}
                      onError={(error) => {
                        console.error('Gallery image failed to load:', imageUrl, error);
                        console.error('Image URL format check:', typeof imageUrl, imageUrl?.startsWith('http'));
                      }}
                      onLoad={() => console.log('Gallery image loaded:', imageUrl)}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              {console.log('Using single image mode - imageUrl:', machinery?.imageUrl, 'fallback to imageUrls[0]:', machinery?.imageUrls?.[0])}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => openImageModal(machinery?.imageUrl || machinery?.imageUrls?.[0])}>
                  {(machinery?.imageUrl || machinery?.imageUrls?.[0]) ? (
                    <Image
                      source={{ uri: machinery.imageUrl || machinery.imageUrls[0] }}
                      style={{ 
                        width: 300, 
                        height: 200, 
                        borderRadius: 12,
                        resizeMode: 'cover'
                      }}
                      onError={(error) => {
                        console.error('Single image failed to load:', machinery?.imageUrl || machinery?.imageUrls?.[0], error);
                      }}
                      onLoad={() => console.log('✅ Single image loaded successfully:', machinery?.imageUrl || machinery?.imageUrls?.[0])}
                    />
                  ) : (
                    <View style={{ 
                      width: 300, 
                      height: 200, 
                      borderRadius: 12,
                      backgroundColor: '#f0f0f0',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Text style={{ fontSize: 14, color: '#999' }}>No Image Available</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Vehicle Condition */}
      {machinery?.specifications?.condition && (
        <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Vehicle Condition
          </Text>
          <Text style={{ fontSize: 16, color: '#47D6FF', fontWeight: '500' }}>
            {machinery.specifications.condition}
          </Text>
        </View>
      )}

      {/* Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: machinery?.specifications?.condition ? 10 : 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Specifications</Text>
      </View>

      {/* Specifications as Separate Bullet Points */}
      <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
        {(() => {
          // Get specifications from list array or individual fields
          const specList = machinery?.specifications?.list || [];
          const specs = specList.length > 0 
            ? specList.filter(spec => spec && spec.trim() !== '')
            : [
                machinery?.specifications?.specification1,
                machinery?.specifications?.specification2,
                machinery?.specifications?.specification3,
                machinery?.specifications?.specification4
              ].filter(spec => spec && spec.trim() !== '');
          
          // Fallback to old format for backward compatibility
          if (specs.length === 0) {
            const oldSpecs = [];
            if (machinery?.specifications?.power) oldSpecs.push(`Power: ${machinery.specifications.power}`);
            if (machinery?.specifications?.capacity) oldSpecs.push(`Capacity: ${machinery.specifications.capacity}`);
            if (machinery?.specifications?.torque) oldSpecs.push(`Torque: ${machinery.specifications.torque}`);
            if (machinery?.specifications?.description) oldSpecs.push(machinery.specifications.description);
            if (oldSpecs.length > 0) {
              return (
                <>
                  {oldSpecs.map((spec, index) => (
                    <View key={index} style={{ marginBottom: 10, paddingLeft: 10 }}>
                      <Text style={{ fontSize: 14, lineHeight: 22, color: '#333' }}>
                        • {spec}
                      </Text>
                    </View>
                  ))}
                </>
              );
            }
          }
          
          if (specs.length > 0) {
            return (
              <>
                {specs.map((spec, index) => (
                  <View key={index} style={{ marginBottom: 10, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 14, lineHeight: 22, color: '#333' }}>
                      • {spec}
                    </Text>
                  </View>
                ))}
              </>
            );
          }
          
          return (
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>No specifications provided</Text>
            </View>
          );
        })()}
      </View>

      {/* Rental Policy */}
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 20, marginBottom: 10 }}>Rental Policy</Text>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        {machinery?.rentalPolicies && machinery.rentalPolicies.length > 0 ? (
          <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15 }}>
            {machinery.rentalPolicies.map((policy, index) => (
              policy && policy !== 'None' ? (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, lineHeight: 20, color: '#333' }}>
                    {policy.startsWith('•') ? policy : `• ${policy}`}
                  </Text>
                </View>
              ) : null
            ))}
          </View>
        ) : (
          <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15 }}>
            <Text style={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>No rental policies specified</Text>
          </View>
        )}
      </View>

      {/* Bottom Section with Buttons */}
      <View
        style={{
          backgroundColor: '#f2f2f2',
          marginTop: 30,
          marginHorizontal: 20,
          borderRadius: 12,
          padding: 20,
          marginBottom: 20
        }}
      >
        <View style={{ marginBottom: 20 }}>
          {(() => {
            // Check if owner should see breakdown
            const currentPrice = parseFloat(machinery?.price || 0);
            let originalPrice = parseFloat(machinery?.originalPrice || 0);
            let commission = parseFloat(machinery?.commission || 0);
            
            // If originalPrice doesn't exist but price exists, calculate breakdown
            // Assume 20% commission if not specified (can be adjusted)
            if (isOwner && currentPrice > 0 && originalPrice === 0) {
              const defaultCommissionPercent = 0.20; // 20% default
              originalPrice = currentPrice / (1 + defaultCommissionPercent);
              commission = currentPrice - originalPrice;
            }
            
            const hasCommission = originalPrice > 0 && currentPrice > originalPrice;
            
            if (isOwner && currentPrice > 0) {
              // Owner sees breakdown: Rent + Commission = Total
              return (
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>
                    Rs. {currentPrice.toLocaleString()} (PKR) / {machinery?.priceUnit || 'day'}
                  </Text>
                  {hasCommission && (
                    <View style={{ backgroundColor: '#e3f2fd', borderRadius: 8, padding: 10, marginTop: 5 }}>
                      <Text style={{ fontSize: 13, color: '#1976d2', marginBottom: 3 }}>
                        <Text style={{ fontWeight: '600' }}>Rent:</Text> Rs. {originalPrice.toFixed(0)} (PKR)
                      </Text>
                      <Text style={{ fontSize: 13, color: '#1976d2', marginBottom: 3 }}>
                        <Text style={{ fontWeight: '600' }}>Commission:</Text> Rs. {commission.toFixed(0)} (PKR)
                      </Text>
                      <Text style={{ fontSize: 13, color: '#1976d2', fontWeight: '600' }}>
                        <Text style={{ fontWeight: '700' }}>Total:</Text> Rs. {currentPrice.toLocaleString()} (PKR)
                      </Text>
                    </View>
                  )}
                </View>
              );
            } else {
              // Other users see only total rent
              return (
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>
                  Rs. {currentPrice.toLocaleString()} (PKR) / {machinery?.priceUnit || 'day'}
                </Text>
              );
            }
          })()}
          {machinery?.securityDeposit && (
            <Text style={{ fontSize: 14, color: '#47D6FF', marginBottom: 5, fontWeight: '600' }}>
              Security Deposit: Rs. {machinery.securityDeposit} (PKR)
            </Text>
          )}
          {(machinery?.ownerName || (ownerAllowsLocation && machinery?.location)) && (
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              Posted by: {machinery?.ownerName || 'Owner'}{ownerAllowsLocation && machinery?.location ? `  •  ${machinery.location}` : ''}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          {isOwner ? (
            // Owner buttons - Edit and Delete
            <>
              <TouchableOpacity onPress={handleEditAd} style={{ flex: 1 }}>
                <View
                  style={{
                    height: 45,
                    borderWidth: 2,
                    borderColor: '#47D6FF',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    flexDirection: 'row'
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#47D6FF" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 15, color: '#47D6FF', fontWeight: '600' }}>Edit Ad</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteAd} style={{ flex: 1 }}>
                <View
                  style={{
                    height: 45,
                    backgroundColor: '#FF4444',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 15, color: '#fff', fontWeight: '600' }}>Delete</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            // Non-owner buttons - Chat and Request
            <>
              <TouchableOpacity onPress={goToChat} style={{ flex: 1, marginRight: 8 }}>
                <View
                  style={{
                    height: 45,
                    borderWidth: 2,
                    borderColor: '#47D6FF',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    flexDirection: 'row'
                  }}
                >
                  <Ionicons name="chatbubble-outline" size={18} color="#47D6FF" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: '#47D6FF', fontWeight: '600' }}>Chat</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={goToRForm} 
                disabled={!isAvailable}
                style={{ 
                  flex: 1, 
                  marginRight: 8,
                  opacity: isAvailable ? 1 : 0.5
                }}
              >
                <View
                  style={{
                    height: 45,
                    backgroundColor: '#47D6FF',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}
                >
                  <Ionicons name={isAvailable ? "calendar-outline" : "close-circle"} size={18} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
                    {isAvailable ? 'Rent' : 'Not Available'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={goToOwnerProfile} style={{ flex: 1 }}>
                <View
                  style={{
                    height: 45,
                    backgroundColor: '#EEF7FF',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderWidth: 2,
                    borderColor: '#47D6FF',
                    paddingHorizontal: 8,
                    maxWidth: '100%'
                  }}
                >
                  <Ionicons name="person-circle-outline" size={18} color="#47D6FF" style={{ marginRight: 4 }} />
                  <Text
                    style={{ fontSize: 13, color: '#47D6FF', fontWeight: '600', flexShrink: 1 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.85}
                  >
                    Owner Profile
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 20,
              padding: 10
            }}
            onPress={closeImageModal}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={closeImageModal}
            activeOpacity={1}
          >
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: screenWidth,
                height: screenHeight * 0.8,
                resizeMode: 'contain'
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
};

export default MachineryDetails;
