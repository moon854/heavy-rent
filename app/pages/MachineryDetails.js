import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View, Modal, Dimensions, Alert } from 'react-native';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteData } from '../Helper/firebaseHelper';

const MachineryDetails = ({ navigation, route }) => {
  const { machinery } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const user = useSelector((state) => state?.home?.user) || {};
  
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
    navigation.navigate("RenterForm");
  };

  const goToChat = () => {
    navigation.navigate("Chat", { 
      chatType: 'ad',
      machinery: machinery 
    });
  };

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
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate("BottomTab")} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Machinery Details</Text>
      </View>
      
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 15, textAlign: 'center' }}>
          {machinery?.name || 'Machinery Name'}
        </Text>

        {/* Image Gallery */}
        <View style={{ marginBottom: 20 }}>
          {console.log('Checking imageUrls:', machinery?.imageUrls, 'Length:', machinery?.imageUrls?.length, 'imageUrl:', machinery?.imageUrl)}
          {(machinery?.imageUrls && machinery.imageUrls.length > 1) ? (
            <>
              {console.log('Using gallery mode - multiple images')}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
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

      {/* Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Specification</Text>
      </View>

      {/* Dynamic Specifications */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10, paddingLeft: 20 }}
      >
        {machinery?.specifications?.power && (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              width: 140,
              height: 60,
              marginRight: 15,
              padding: 8,
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Power</Text>
            <Text style={{ fontSize: 12 }}>{machinery.specifications.power}</Text>
          </View>
        )}

        {machinery?.specifications?.capacity && (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              width: 140,
              height: 60,
              marginRight: 15,
              padding: 8,
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Capacity</Text>
            <Text style={{ fontSize: 12 }}>{machinery.specifications.capacity}</Text>
          </View>
        )}

        {machinery?.specifications?.torque && (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              width: 140,
              height: 60,
              marginRight: 15,
              padding: 8,
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Torque</Text>
            <Text style={{ fontSize: 12 }}>{machinery.specifications.torque}</Text>
          </View>
        )}

        {machinery?.specifications?.condition && (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              width: 140,
              height: 60,
              marginRight: 15,
              padding: 8,
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Condition</Text>
            <Text style={{ fontSize: 12 }}>{machinery.specifications.condition}</Text>
          </View>
        )}
      </ScrollView>

      {/* Rental Policy */}
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 20, marginBottom: 10 }}>Rental Policy</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {machinery?.rentalPolicies?.map((policy, index) => (
          <View
            key={index}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              width: 170,
              height: 50,
              marginTop: 20,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 12 }}>{policy}</Text>
          </View>
        )) || (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              width: 170,
              height: 50,
              marginTop: 20,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 12 }}>No rental policies specified</Text>
          </View>
        )}
      </View>

      {/* Bottom Section with Buttons */}
      <View
        style={{
          backgroundColor: '#f2f2f2',
          marginTop: 30,
          marginHorizontal: 20,
          height: 140,
          borderRadius: 12,
          padding: 20,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            ${machinery?.price || 0} / {machinery?.priceUnit || 'day'}
          </Text>
          {machinery?.ownerName && (
            <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
              Posted by: {machinery.ownerName}
            </Text>
          )}
          {machinery?.location && (
            <Text style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
              Location: {machinery.location}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {isOwner ? (
            // Owner buttons - Edit and Delete
            <>
              <TouchableOpacity onPress={handleEditAd}>
                <View
                  style={{
                    width: 150,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#47D6FF',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#47D6FF' }}>Edit Ad</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteAd}>
                <View
                  style={{
                    width: 150,
                    height: 40,
                    backgroundColor: '#FF4444',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#fff' }}>Delete Ad</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            // Non-owner buttons - Chat and Request
            <>
              <TouchableOpacity onPress={goToChat}>
                <View
                  style={{
                    width: 150,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#47D6FF',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#47D6FF' }}>Chat With Admin</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={goToRForm}>
                <View
                  style={{
                    width: 150,
                    height: 40,
                    backgroundColor: '#47D6FF',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#fff' }}>Request For Rent</Text>
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
  );
};

export default MachineryDetails;
