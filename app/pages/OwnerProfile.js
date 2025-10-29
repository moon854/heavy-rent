import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllData, getDataById } from '../Helper/firebaseHelper';

const OwnerProfile = ({ navigation, route }) => {
  const { ownerId, ownerName } = route.params || {};
  const [ads, setAds] = useState([]);
  const [ownerUser, setOwnerUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerAds = async () => {
      try {
        const allMachinery = await getAllData('machinery');
        const ownerAds = (allMachinery || []).filter(item => item.ownerId === ownerId && item.status === 'approved');
        setAds(ownerAds);
      } catch (e) {
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchOwnerUser = async () => {
      try {
        if (ownerId) {
          const userDoc = await getDataById('users', ownerId);
          setOwnerUser(userDoc);
        }
      } catch {}
    };

    fetchOwnerAds();
    fetchOwnerUser();
  }, [ownerId]);

  const goToDetails = (machinery) => {
    navigation.navigate('MachineryDetails', { machinery });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Owner Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {ownerUser?.imageUrl ? (
            <Image
              source={{ uri: ownerUser.imageUrl }}
              style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#47D6FF' }}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={90} color="#47D6FF" />
          )}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>
            {(ownerUser?.firstName || ownerUser?.lastName)
              ? `${ownerUser?.firstName || ''} ${ownerUser?.lastName || ''}`.trim()
              : (ownerName || 'Owner')}
          </Text>
          {(() => {
            const displayLocation = ownerUser?.location || ownerUser?.address || ads?.[0]?.location;
            if (!displayLocation) return null;
            return (
              <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                📍 {displayLocation}
              </Text>
            );
          })()}
          <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Posted Ads: {ads.length}</Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Ads by {ownerName || 'Owner'}</Text>

        {loading ? (
          <Text style={{ textAlign: 'center', color: '#666' }}>Loading...</Text>
        ) : ads.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#666' }}>No ads found for this owner.</Text>
        ) : (
          ads.map(item => (
            <TouchableOpacity key={item.id} onPress={() => goToDetails(item)}
              style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, elevation: 3, padding: 10, marginBottom: 12 }}>
              {(item.imageUrl || (item.imageUrls && item.imageUrls[0])) ? (
                <Image source={{ uri: item.imageUrl || item.imageUrls[0] }}
                  style={{ width: 90, height: 90, borderRadius: 8, marginRight: 12 }} />
              ) : (
                <View style={{ width: 90, height: 90, borderRadius: 8, marginRight: 12, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#999', fontSize: 12 }}>No Image</Text>
                </View>
              )}
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: '#47D6FF', fontWeight: '600', marginTop: 2 }}>${item.price}/{item.priceUnit}</Text>
                {item.location && (
                  <Text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>📍 {item.location}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default OwnerProfile;


