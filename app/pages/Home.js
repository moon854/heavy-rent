import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserProfile from '../../components/UserProfile';

const Home = ({ navigation }) => {
  const goToSubCat = () => {
    navigation.getParent()?.navigate("Excavators");
  }

  const goToAdForm = () => {
    navigation.getParent()?.navigate("AdForm");
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 30 }}>
        <View style={{ width: 150, height: 50, display: 'flex', flexDirection: 'row' }} >
          <AntDesign name="search1" size={24} color="black" style={{ marginTop: 13 }} />
          <View>
            <TextInput
              style={{ width: 100, height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 0, paddingLeft: 10 }}
              placeholder="Search"
            />
          </View>
        </View>
        <View style={{ width: 120, height: 60 }}>
          <UserProfile 
            size="medium" 
            showName={false}
            imageStyle={{ marginLeft: 60 }}
          />
        </View>
      </View>

      <TouchableOpacity onPress={goToAdForm}>
        <View style={{ width: 120, height: 45, backgroundColor: '#47D6FF', borderRadius: 10, marginTop: 20, alignSelf: 'center' }}>
          <Text style={{ fontSize: 15, color: 'white', textAlign: 'center', paddingTop: 10 }}>+Place</Text>
        </View>
      </TouchableOpacity>

      <View style={{ width: '80%', height: 45, backgroundColor: '#66e0ff', borderRadius: 10, marginTop: 20, alignSelf: 'center' }} >
        <Text style={{ fontSize: 15, color: 'white', textAlign: 'center', paddingTop: 10 }}>Categories</Text>
      </View>

      {/* Categories Rows */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity onPress={goToSubCat} style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 113, 
            height: 80, 
            marginTop: 50, 
            borderColor: '#47D6FF', 
            borderWidth: 1, 
            borderRadius: 10,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="excavator" size={40} color="#47D6FF" />
          </View>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333',
            textAlign: 'center'
          }}>
            Excavators
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 113, 
            height: 80, 
            marginTop: 50, 
            borderColor: '#47D6FF', 
            borderWidth: 1, 
            borderRadius: 10,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="tow-truck" size={40} color="#47D6FF" />
          </View>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333',
            textAlign: 'center'
          }}>
            Concrete Equipment
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 113, 
            height: 80, 
            marginTop: 50, 
            borderColor: '#47D6FF', 
            borderWidth: 1, 
            borderRadius: 10,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="crane" size={40} color="#47D6FF" />
          </View>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333',
            textAlign: 'center'
          }}>
            Cranes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 113, 
            height: 80, 
            marginTop: 50, 
            borderColor: '#47D6FF', 
            borderWidth: 1, 
            borderRadius: 10,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialIcons name="business" size={40} color="#47D6FF" />
          </View>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333',
            textAlign: 'center'
          }}>
            Building Equipment
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 113, 
            height: 80, 
            marginTop: 50, 
            borderColor: '#47D6FF', 
            borderWidth: 1, 
            borderRadius: 10,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="road-variant" size={40} color="#47D6FF" />
          </View>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333',
            textAlign: 'center'
          }}>
            Road Construction
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 113, 
            height: 80, 
            marginTop: 50, 
            borderColor: '#47D6FF', 
            borderWidth: 1, 
            borderRadius: 10,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialIcons name="palette" size={40} color="#47D6FF" />
          </View>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333',
            textAlign: 'center'
          }}>
            Surface Finishing
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Home

