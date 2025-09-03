import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

const RentalEstimation = ({ navigation }) => {
    
        const goToPayment = () => {
        navigation.navigate("Payment");
      }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      
      {/* Heading */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Rental estimation details
      </Text>
      <View style={{ height: 1, backgroundColor: "#ddd", marginBottom: 15 }} />

      {/* Principal Payment */}
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
        Principal payment
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ fontSize: 14 }}>Rent /unit</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Rp. 25,000</Text>
      </View>
      <View style={{ height: 1, backgroundColor: "#eee", marginBottom: 15 }} />

      {/* Tax Section */}
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>Tax</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>PPH</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Rp. 2,500</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ fontSize: 14 }}>VAT</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Rp. 2,500</Text>
      </View>
      <View style={{ height: 1, backgroundColor: "#eee", marginBottom: 15 }} />

      {/* Other Costs */}
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>Other costs</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>Solar cost</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Rp. 2,400</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>Operator costs</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Rp. 2,600</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ fontSize: 14 }}>Security Cost</Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Rp. 5,000</Text>
      </View>

      {/* Total Cost */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: "600" }}>Total Cost</Text>
        <Text style={{ fontSize: 15, fontWeight: "600" }}>Rp. 40,000</Text>
      </View>

      {/* Proceed to Pay Button */}
      <TouchableOpacity onPress={goToRForm}> <View> <Text style={{ fontSize: 15, marginRight: 20, marginTop: 30, backgroundColor: '#47D6FF', borderRadius: 8, width: 150, height: 40 }}>Request For Rent</Text> </View></TouchableOpacity>
    </ScrollView>
  )
}

export default RentalEstimation
