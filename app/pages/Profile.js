import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { clearUser, refreshUser } from '../redux/Slices/HomeDataSlice';
import UserProfile from '../../components/UserProfile';
import { useCallback } from 'react';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home.user);
  const userFirstName = useSelector((state) => state.home.user?.firstName);
  const userLastName = useSelector((state) => state.home.user?.lastName);
  const navigation = useNavigation();

  // Force re-render when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // This will cause the component to re-render when the screen comes into focus
      console.log('Profile screen focused, current user:', user);
      console.log('User firstName:', user?.firstName);
      console.log('User lastName:', user?.lastName);
      // Force refresh of user data
      dispatch(refreshUser());
    }, [dispatch])
  );

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(clearUser());
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {/* Header */}
      <View style={{
        backgroundColor: '#47D6FF',
        height: 180,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>
          HeavyRent
        </Text>
        <UserProfile 
          key={`${user?.firstName}-${user?.lastName}-${user?.imageUrl}`}
          size="large" 
          showName={true}
          imageStyle={{
            marginTop: 15,
            borderColor: '#fff'
          }}
          textStyle={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            marginTop: 10
          }}
        />
      </View>

      {/* Menu Items */}
      <View style={{ marginTop: 40, paddingHorizontal: 20 }}>

        {/* Profile */}
        <TouchableOpacity 
          onPress={() => {
            navigation.getParent()?.navigate('ProfileEdit');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
          <Ionicons name="person-outline" size={22} color="#47D6FF" />
          <Text style={{ marginLeft: 15, fontSize: 16 }}>My profile</Text>
        </TouchableOpacity>

        {/* My Ads */}
        <TouchableOpacity 
          onPress={() => navigation.getParent()?.navigate('MyAds')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
          <Ionicons name="document-text-outline" size={22} color="#47D6FF" />
          <Text style={{ marginLeft: 15, fontSize: 16 }}>My Ads</Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity 
          onPress={() => navigation.getParent()?.navigate('Settings')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
          <Feather name="settings" size={22} color="#47D6FF" />
          <Text style={{ marginLeft: 15, fontSize: 16 }}>Settings</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity 
          onPress={() => {
            alert('Notification settings will be implemented soon!');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
          <Ionicons name="notifications-outline" size={22} color="#47D6FF" />
          <Text style={{ marginLeft: 15, fontSize: 16 }}>Notification</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15
          }}>
          <MaterialIcons name="logout" size={22} color="#47D6FF" />
          <Text style={{ marginLeft: 15, fontSize: 16 }}>Log out</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Profile;
