import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

const Success = ({ navigation }) => {
    
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 20, alignItems: "center", justifyContent: "center" }}>
        
       <Image source={require('../../assets/images/success.jpg')} style={{ width: 200, height: 200, resizeMode: "contain" }} />

        {/* Thank You Text */}
        <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 10 }}>
          Thank you for submitting the order.
        </Text>

        {/* Additional Info */}
        <Text style={{ fontSize: 14, textAlign: "center", color: "#333", marginBottom: 30 }}>
          Furthermore, we will contact to provide{"\n"}payment information and shipping units
        </Text>

        {/* Return Button */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")} 
          style={{ backgroundColor: "#47D6FF", padding: 15, borderRadius: 8, width: "90%", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Return To Home</Text>
        </TouchableOpacity>

      </View>
    </>
  )
}

export default Success
