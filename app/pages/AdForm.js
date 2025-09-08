import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'


const AdForm = ({ navigation }) => {
  const [file, setFile] = useState(null)

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({})
    if (result.type === "success") {
      setFile(result.name)
    }
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

        {/* Inputs */}
        <TextInput placeholder="Full name" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="Telephone / whatsapp" keyboardType="phone-pad" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="Complete address" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="Company / organization" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="CNIC Number" keyboardType="numeric" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="Vehicle Name" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="Vehicle Condition" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />
        <TextInput placeholder="Rent Per Day" style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15 }} />

        {/* File Picker */}
        <TouchableOpacity onPress={pickFile} style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, alignItems: "center", marginBottom: 20, backgroundColor: "#f9f9f9" }}>
          <Text style={{ color: "#555" }}>{file ? file : "Select File"}</Text>
        </TouchableOpacity>

        {/* Post Button */}
        <TouchableOpacity onPress={() => alert("Ad Posted")} style={{ backgroundColor: "#47D6FF", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 40 }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Post Ad</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

export default AdForm
