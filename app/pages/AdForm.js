import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'


const AdForm = ({ navigation }) => {
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    telephone: '',
    address: '',
    company: '',
    cnic: '',
    vehicleName: '',
    vehicleCondition: '',
    rentPerDay: '',
    power: '',
    machineCapacity: '',
    torque: '',
    rentalPolicy1: '',
    rentalPolicy2: '',
    rentalPolicy3: '',
    rentalPolicy4: ''
  })

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({})
    if (result.type === "success") {
      setFile(result.name)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        
        {/* Image */}
        <Image source={{ uri: "https://img.icons8.com/color/344/customer-support.png" }}
          style={{ width: 150, height: 150, alignSelf: "center", marginBottom: 20, resizeMode: "contain" }} />

        {/* Heading */}
        <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 }}>
          Please fill in the data below for posting ad
        </Text>

        {/* Basic Information */}
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <TextInput 
          placeholder="Full name" 
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Telephone / whatsapp" 
          keyboardType="phone-pad" 
          value={formData.telephone}
          onChangeText={(value) => handleInputChange('telephone', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Complete address" 
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Company / organization" 
          value={formData.company}
          onChangeText={(value) => handleInputChange('company', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="CNIC Number" 
          keyboardType="numeric" 
          value={formData.cnic}
          onChangeText={(value) => handleInputChange('cnic', value)}
          style={styles.input} 
        />

        {/* Vehicle Information */}
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <TextInput 
          placeholder="Vehicle Name" 
          value={formData.vehicleName}
          onChangeText={(value) => handleInputChange('vehicleName', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Vehicle Condition" 
          value={formData.vehicleCondition}
          onChangeText={(value) => handleInputChange('vehicleCondition', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Rent Per Day" 
          keyboardType="numeric"
          value={formData.rentPerDay}
          onChangeText={(value) => handleInputChange('rentPerDay', value)}
          style={styles.input} 
        />

        {/* Machine Specifications */}
        <Text style={styles.sectionTitle}>Machine Specifications</Text>
        <TextInput 
          placeholder="Power (e.g., 110 ps @ 2,800 rpm)" 
          value={formData.power}
          onChangeText={(value) => handleInputChange('power', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Machine Capacity (e.g., 4,009 cc)" 
          value={formData.machineCapacity}
          onChangeText={(value) => handleInputChange('machineCapacity', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Torque (e.g., 28.0 kgm @ 1,800 rpm)" 
          value={formData.torque}
          onChangeText={(value) => handleInputChange('torque', value)}
          style={styles.input} 
        />

        {/* Rental Policy */}
        <Text style={styles.sectionTitle}>Rental Policy</Text>
        <TextInput 
          placeholder="Rental Policy 1 (e.g., The rental price includes PPh and VAT)" 
          value={formData.rentalPolicy1}
          onChangeText={(value) => handleInputChange('rentalPolicy1', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Rental Policy 2" 
          value={formData.rentalPolicy2}
          onChangeText={(value) => handleInputChange('rentalPolicy2', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Rental Policy 3" 
          value={formData.rentalPolicy3}
          onChangeText={(value) => handleInputChange('rentalPolicy3', value)}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Rental Policy 4" 
          value={formData.rentalPolicy4}
          onChangeText={(value) => handleInputChange('rentalPolicy4', value)}
          style={styles.input} 
        />

        {/* File Picker */}
        <TouchableOpacity onPress={pickFile} style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, alignItems: "center", marginBottom: 20, backgroundColor: "#f9f9f9" }}>
          <Text style={{ color: "#555" }}>{file ? file : "Select File"}</Text>
        </TouchableOpacity>

        {/* Post Button */}
        <TouchableOpacity onPress={() => {
          console.log('Form Data:', formData);
          alert("Ad Posted Successfully!");
        }} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Post Ad</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    fontSize: 16
  },
  submitButton: {
    backgroundColor: "#47D6FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
})

export default AdForm
