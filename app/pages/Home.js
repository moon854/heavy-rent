import AntDesign from '@expo/vector-icons/AntDesign';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Home = ({ navigation }) => {
  const goToSubCat = () => {
    navigation.navigate("Excavators");
  }

  const goToAdForm = () => {
    navigation.navigate("AdForm");
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
          <Image
            source={require('../../assets/images/dp.png.jpg')}
            style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 60 }}
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
        <TouchableOpacity onPress={goToSubCat}>
          <Image source={require('../../assets/images/Excavator.jpg')} style={{ width: 113, height: 80, marginTop: 50, borderColor: '#47D6FF', borderWidth: 1, borderRadius: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/concrete.jpg')} style={{ width: 113, height: 80, marginTop: 50, borderColor: '#47D6FF', borderWidth: 1, borderRadius: 10 }} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/crane.jpg')} style={{ width: 113, height: 80, marginTop: 50, borderColor: '#47D6FF', borderWidth: 1, borderRadius: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/builging.jpg')} style={{ width: 113, height: 80, marginTop: 50, borderColor: '#47D6FF', borderWidth: 1, borderRadius: 10 }} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/road.jpg')} style={{ width: 113, height: 80, marginTop: 50, borderColor: '#47D6FF', borderWidth: 1, borderRadius: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/surface.jpg')} style={{ width: 113, height: 80, marginTop: 50, borderColor: '#47D6FF', borderWidth: 1, borderRadius: 10 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Home

