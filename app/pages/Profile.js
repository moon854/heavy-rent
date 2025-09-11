import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Slices/HomeDataSlice';

const Profile = () => {


  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(setUser({}));
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
        <Image
          source={require('../../assets/images/dp.png.jpg')}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginTop: 15,
            borderWidth: 2,
            borderColor: '#fff'
          }}
        />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '600' }}>Embatusyam</Text>
      </View>

      {/* Menu Items */}
      <View style={{ marginTop: 40, paddingHorizontal: 20 }}>

        {/* Profile */}
        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}>
          <Ionicons name="person-outline" size={22} color="#47D6FF" />
          <Text style={{ marginLeft: 15, fontSize: 16 }}>My profile</Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity style={{
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
        <TouchableOpacity style={{
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
