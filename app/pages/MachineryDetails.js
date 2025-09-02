import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
const MachineryDetails = () => {
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
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View> <Text style={{ fontSize: 20, marginLeft: 20 }}>Power</Text></View>
      </View>
    </>
  )
}

export default MachineryDetails