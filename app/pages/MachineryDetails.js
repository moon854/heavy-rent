import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
const MachineryDetails = ({ navigation }) => {
  const goToRForm = () => {
    navigation.navigate("RenterForm");
  }
  return (
    <>
      <View> <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20 }}>Rippa R57</Text> </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Entypo style={{ marginLeft: 20, marginTop: 4 }} name="star-outlined" size={20} color="#F2CF63" />
        <Text style={{ fontSize: 20, marginLeft: 5 }}>5.5</Text>
      </View>
      <Image source={require('../../assets/images/ex2.webp')} style={{ width: 271, height: 181, marginTop: -10, marginLeft: 50 }} />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View> <Text style={{ fontSize: 20, marginLeft: 20 }}>Specification</Text> </View>
        <TouchableOpacity>  <View> <Text style={{ fontSize: 15, marginLeft: 160 }}>See All </Text> </View></TouchableOpacity>
        <FontAwesome style={{ marginTop: 1, marginRight: 20 }} name="angle-right" size={18} color="black" />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={{ outlineColor: 'black', outlineWidth: 1, borderRadius: 8, width: 140, height: 50 }}>
          <View> <Text style={{ fontSize: 20, marginLeft: 10 }}>Power</Text></View>
          <View> <Text style={{ fontSize: 10, marginLeft: 0 }}>110 ps @ 2,800 rpm</Text></View>

        </View>
        <View style={{ outlineColor: 'black', outlineWidth: 1, borderRadius: 8, width: 140, height: 50 }}>
          <View> <Text style={{ fontSize: 20, marginLeft: 10 }}>Machine</Text></View>
          <View> <Text style={{ fontSize: 10, marginLeft: 20 }}>4,009 cc</Text></View>

        </View>
        <View style={{ outlineColor: 'black', outlineWidth: 1, borderRadius: 8, width: 140, height: 50 }}>
          <View> <Text style={{ fontSize: 20, marginLeft: 10 }}>Torque</Text></View>
          <View> <Text style={{ fontSize: 10, marginLeft: 20 }}>28.0 kgm @ 1,800 rpmm</Text></View>
        </View>
      </View>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 20 }}> Rental Policy </Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={{ outlineColor: 'gray', outlineWidth: 1, borderRadius: 8, width: 170, height: 50, marginTop: 20 }}><Text style={{ fontSize: 15, marginLeft: 10 }}>The rental price includes PPh and VAT</Text></View>
        <View style={{ outlineColor: 'gray', outlineWidth: 1, borderRadius: 8, width: 170, height: 50, marginTop: 20 }}><Text style={{ fontSize: 15, marginLeft: 10 }}>The rental price includes PPh and VAT</Text></View>

      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={{ outlineColor: 'gray', outlineWidth: 1, borderRadius: 8, width: 170, height: 50, marginTop: 20 }}><Text style={{ fontSize: 15, marginLeft: 10 }}>The rental price includes PPh and VAT</Text></View>
        <View style={{ outlineColor: 'gray', outlineWidth: 1, borderRadius: 8, width: 170, height: 50, marginTop: 20 }}><Text style={{ fontSize: 15, marginLeft: 10 }}>The rental price includes PPh and VAT</Text></View>

      </View>
      <View style={{ backgroundColor: '#f2f2f2', marginTop: 50, width: '98%', height: 140, alignSelf: 'center', boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)', borderRadius: 0 }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 15 }}>Rp. 40,000 / 24 hours </Text> </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity>
          <View style={{ width: 150, height: 40 }}> <Text style={{ fontSize: 15, outlineColor: '#47D6FF', outlineWidth: 1, borderRadius: 8, marginTop: 'auto' }}>Chat With Admin</Text> </View></TouchableOpacity>
         <TouchableOpacity onPress={goToRForm}> <View> <Text style={{ fontSize: 15, marginRight: 20, marginTop: 30, backgroundColor: '#47D6FF', borderRadius: 8, width: 150, height: 40 }}>Request For Rent</Text> </View></TouchableOpacity>
        </View>
      </View>

    </>
  )
}

export default MachineryDetails