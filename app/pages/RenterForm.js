import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const RenterForm = ({ navigation, route }) => {
  const machineryData = route?.params?.machineryData || {};
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    cnic: '',
    rentalStartDate: '',
    rentalDuration: '1 Day',
    deliveryLocation: '',
    projectType: 'Construction',
    operatorRequired: 'No',
    emergencyContact: '',
    emergencyName: '',
    acceptedTerms: false
  })

  const [showDurationPicker, setShowDurationPicker] = useState(false)
  const [showProjectPicker, setShowProjectPicker] = useState(false)

  const durations = ['1 Day', '3 Days', '1 Week', '2 Weeks', '1 Month', 'Custom']
  const projectTypes = ['Construction', 'Road Work', 'Mining', 'Demolition', 'Landscaping', 'Other']

  const goToRentalEst = () => {
    // Validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.cnic) {
      alert('Please fill all required fields')
      return
    }
    if (!formData.deliveryLocation) {
      alert('Please enter delivery location')
      return
    }
    if (!formData.rentalStartDate) {
      alert('Please enter rental start date')
      return
    }
    if (!formData.acceptedTerms) {
      alert('Please accept terms and conditions')
      return
    }
    navigation.navigate("RentalEstimation", { 
      rentalData: formData, 
      machineryData: machineryData 
    });
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
      <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 10, color: '#333' }}>
        Rental Request Form
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", marginBottom: 25, color: '#666' }}>
        Please fill in the details below
      </Text>

      {/* Section: Personal Information */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📋 Personal Information
        </Text>
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Full Name *" 
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Phone / WhatsApp *" 
          keyboardType="phone-pad" 
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
        />
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Complete Address *" 
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="CNIC Number *" 
          keyboardType="numeric" 
          value={formData.cnic}
          onChangeText={(text) => setFormData({ ...formData, cnic: text })}
        />
      </View>

      {/* Section: Rental Details */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📅 Rental Details
        </Text>
        
        {/* Start Date */}
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Rental Start Date (e.g., 15/01/2025) *" 
          value={formData.rentalStartDate}
          onChangeText={(text) => setFormData({ ...formData, rentalStartDate: text })}
        />

        {/* Duration */}
        <TouchableOpacity 
          onPress={() => setShowDurationPicker(!showDurationPicker)}
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: '#333' }}>Duration: {formData.rentalDuration}</Text>
          <Ionicons name={showDurationPicker ? "chevron-up" : "chevron-down"} size={20} color="#47D6FF" />
        </TouchableOpacity>

        {showDurationPicker && (
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }}>
            {durations.map((duration, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setFormData({ ...formData, rentalDuration: duration })
                  setShowDurationPicker(false)
                }}
                style={{ paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: index < durations.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}
              >
                <Text style={{ color: formData.rentalDuration === duration ? '#47D6FF' : '#333' }}>{duration}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Delivery Location */}
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Delivery/Site Location *" 
          value={formData.deliveryLocation}
          onChangeText={(text) => setFormData({ ...formData, deliveryLocation: text })}
        />

        {/* Project Type */}
        <TouchableOpacity 
          onPress={() => setShowProjectPicker(!showProjectPicker)}
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: '#333' }}>Project Type: {formData.projectType}</Text>
          <Ionicons name={showProjectPicker ? "chevron-up" : "chevron-down"} size={20} color="#47D6FF" />
        </TouchableOpacity>

        {showProjectPicker && (
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }}>
            {projectTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setFormData({ ...formData, projectType: type })
                  setShowProjectPicker(false)
                }}
                style={{ paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: index < projectTypes.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}
              >
                <Text style={{ color: formData.projectType === type ? '#47D6FF' : '#333' }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Operator Required */}
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Operator Required?</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity 
              onPress={() => setFormData({ ...formData, operatorRequired: 'Yes' })}
              style={{ 
                flex: 1, 
                borderWidth: 1, 
                borderColor: formData.operatorRequired === 'Yes' ? '#47D6FF' : '#ddd', 
                borderRadius: 8, 
                paddingVertical: 12, 
                alignItems: 'center',
                backgroundColor: formData.operatorRequired === 'Yes' ? '#47D6FF10' : '#f9f9f9'
              }}
            >
              <Text style={{ color: formData.operatorRequired === 'Yes' ? '#47D6FF' : '#333', fontWeight: formData.operatorRequired === 'Yes' ? '600' : '400' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFormData({ ...formData, operatorRequired: 'No' })}
              style={{ 
                flex: 1, 
                borderWidth: 1, 
                borderColor: formData.operatorRequired === 'No' ? '#47D6FF' : '#ddd', 
                borderRadius: 8, 
                paddingVertical: 12, 
                alignItems: 'center',
                backgroundColor: formData.operatorRequired === 'No' ? '#47D6FF10' : '#f9f9f9'
              }}
            >
              <Text style={{ color: formData.operatorRequired === 'No' ? '#47D6FF' : '#333', fontWeight: formData.operatorRequired === 'No' ? '600' : '400' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Section: Emergency Contact */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          🆘 Emergency Contact
        </Text>
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Emergency Contact Name" 
          value={formData.emergencyName}
          onChangeText={(text) => setFormData({ ...formData, emergencyName: text })}
        />
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Emergency Contact Number" 
          keyboardType="phone-pad"
          value={formData.emergencyContact}
          onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
        />
      </View>

      {/* Terms & Conditions */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📋 Terms & Conditions
        </Text>
        
        <View style={{ 
          backgroundColor: '#f9f9f9', 
          borderWidth: 1, 
          borderColor: '#ddd', 
          borderRadius: 8, 
          padding: 15, 
          marginBottom: 15 
        }}>
          <Text style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '600' }}>
            Payment Requirements:
          </Text>
          <Text style={{ fontSize: 13, color: '#666', lineHeight: 20 }}>
            • Machinery Security Deposit{'\n'}
            • 50% Rent Advance Payment{'\n'}
            • Balance payment upon delivery
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => setFormData({ ...formData, acceptedTerms: !formData.acceptedTerms })}
          style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}
        >
          <View style={{ 
            width: 24, 
            height: 24, 
            borderWidth: 2, 
            borderColor: formData.acceptedTerms ? '#47D6FF' : '#ccc', 
            borderRadius: 4, 
            marginRight: 10,
            backgroundColor: formData.acceptedTerms ? '#47D6FF' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 2
          }}>
            {formData.acceptedTerms && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
          <Text style={{ flex: 1, fontSize: 13, color: '#666', lineHeight: 20 }}>
            I accept the rental terms and conditions including security deposit and 50% advance payment requirement *
          </Text>
        </TouchableOpacity>
      </View>

      {/* Button */}
      <TouchableOpacity 
        onPress={goToRentalEst} 
        style={{ 
          width: "100%", 
          backgroundColor: "#47D6FF", 
          paddingVertical: 15, 
          borderRadius: 8, 
          alignItems: "center", 
          marginBottom: 30,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", marginRight: 8 }}>Proceed to Checkout</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

    </ScrollView>
  )
}

export default RenterForm
