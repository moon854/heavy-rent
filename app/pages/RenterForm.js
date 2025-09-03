import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'

const RenterForm = ({ navigation }) => {
  const goToRentalEst = () => {
    navigation.navigate("RentalEstimation");
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
      
      {/* Logo */}
      <Image source={require('../../assets/images/Heavy.png')} style={{ width: 150, height: 150, marginVertical: 20, resizeMode: "contain" }} />

      {/* Heading */}
      <Text style={{ fontSize: 16, fontWeight: "500", textAlign: "center", marginBottom: 20 }}>
        Please fill in the data below for renting
      </Text>

      {/* Form Fields */}
      <TextInput style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, marginBottom: 15 }} placeholder="Full name" />
      <TextInput style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, marginBottom: 15 }} placeholder="Telephone / whatsapp" keyboardType="phone-pad" />
      <TextInput style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, marginBottom: 15 }} placeholder="Complete address" />
      <TextInput style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, marginBottom: 15 }} placeholder="Company / organization" />
      <TextInput style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, marginBottom: 15 }} placeholder="Vehicle Name" />
      <TextInput style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, marginBottom: 15 }} placeholder="CNIC Number" keyboardType="numeric" />

      {/* Button */}
      <TouchableOpacity onPress={goToRentalEst} style={{ width: "100%", backgroundColor: "#47D6FF", paddingVertical: 15, borderRadius: 8, alignItems: "center", marginTop: 20 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Checkout</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

export default RenterForm
