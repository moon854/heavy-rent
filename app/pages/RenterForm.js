import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'

const RenterForm = ({ navigation }) => {
  const goToRentalEst = () => {
    navigation.navigate("RentalEstimation");
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
      
      {/* Logo */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', marginRight: 15, position: 'relative' }}>
            <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#47D6FF', position: 'absolute', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }} />
            <View style={{ width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, borderColor: '#47D6FF', position: 'absolute', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }} />
            <View style={{ width: 20, height: 20, backgroundColor: '#47D6FF', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }} />
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', letterSpacing: 1, marginBottom: 2 }}>RENT</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', letterSpacing: 0.5, marginBottom: 2, opacity: 0.9 }}>TO</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', letterSpacing: 1 }}>BUILD</Text>
          </View>
        </View>
      </View>

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
