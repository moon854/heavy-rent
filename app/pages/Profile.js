import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { clearUser, refreshUser, setUser } from '../redux/Slices/HomeDataSlice';
import UserProfile from '../../components/UserProfile';
import { useCallback, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import UserNotificationService from '../services/UserNotificationService';
import { getDataById } from '../Helper/firebaseHelper';
import { getAuth } from 'firebase/auth';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home.user);
  const userFirstName = useSelector((state) => state.home.user?.firstName);
  const userLastName = useSelector((state) => state.home.user?.lastName);
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileKey, setProfileKey] = useState(0);

  // Live unread notification count
  useEffect(() => {
    const userId = user?.uid || user?.id;
    if (!userId) return;
    // Subscribe and derive unread count from incoming list
    const unsubscribe = UserNotificationService.subscribeToNotifications(userId, (list) => {
      const count = list.filter(n => n.status === 'unread').length;
      setUnreadCount(count);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid, user?.id]);

  // Force re-render when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Fetch fresh user data from Firebase when screen comes into focus
      const fetchFreshUserData = async () => {
        try {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid) {
            console.log('Profile screen focused - Fetching fresh user data from Firebase...');
            const freshUserData = await getDataById('users', currentUser.uid);
            if (freshUserData) {
              console.log('Fresh user data fetched:', freshUserData);
              console.log('Image URL in fresh data:', freshUserData.imageUrl);
              console.log('Current Redux imageUrl:', user?.imageUrl);
              
              // Always update Redux with fresh data
              dispatch(setUser(freshUserData));
              
              // Force UserProfile component to re-mount by changing key
              // This ensures the image component is completely remounted
              setProfileKey(prev => prev + 1);
              console.log('Profile key updated to force remount');
            }
          }
        } catch (error) {
          console.error('Error fetching fresh user data:', error);
        }
      };
      
      fetchFreshUserData();
    }, [dispatch, user?.imageUrl])
  );

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(clearUser());
  };


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={{
        backgroundColor: colors.primary,
        height: 180,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{ color: colors.textInverse, fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>
          Rent-To-Build
        </Text>
        <UserProfile 
          key={`profile-${user?.uid || 'default'}-${user?.imageUrl || 'no-image'}-${profileKey}`}
          size="large" 
          showName={true}
          imageStyle={{
            marginTop: 15,
            borderColor: colors.textInverse
          }}
          textStyle={{
            color: colors.textInverse,
            fontSize: 16,
            fontWeight: '600',
            marginTop: 10
          }}
        />
        {user?.location || user?.address ? (
          <Text style={{ color: colors.textInverse, marginTop: 6, opacity: 0.9 }}>
            📍 {user?.location || user?.address}
          </Text>
        ) : null}
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
            borderBottomColor: colors.border
          }}>
          <Ionicons name="person-outline" size={22} color={colors.primary} />
          <Text style={{ marginLeft: 15, fontSize: 16, color: colors.textPrimary }}>My profile</Text>
        </TouchableOpacity>

        {/* My Ads */}
        <TouchableOpacity 
          onPress={() => navigation.getParent()?.navigate('MyAds')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }}>
          <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          <Text style={{ marginLeft: 15, fontSize: 16, color: colors.textPrimary }}>My Ads</Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity 
          onPress={() => navigation.getParent()?.navigate('Settings')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }}>
          <Feather name="settings" size={22} color={colors.primary} />
          <Text style={{ marginLeft: 15, fontSize: 16, color: colors.textPrimary }}>Settings</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Notifications')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }}>
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          <Text style={{ marginLeft: 15, fontSize: 16, color: colors.textPrimary }}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={{
              backgroundColor: colors.error || '#F44336',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 10
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15
          }}>
          <MaterialIcons name="logout" size={22} color={colors.primary} />
          <Text style={{ marginLeft: 15, fontSize: 16, color: colors.textPrimary }}>Log out</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Profile;
