import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const AuthChoice = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 }}>
      
      {/* Login Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate("Login")} 
        style={{ backgroundColor: "#47D6FF", width: "70%", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Login</Text>
      </TouchableOpacity>

      {/* OR text */}
      <Text style={{ marginBottom: 20, fontSize: 14, fontWeight: "500" }}>OR</Text>

      {/* Register Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate("Register")} 
        style={{ backgroundColor: "#47D6FF", width: "70%", padding: 15, borderRadius: 8, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Register</Text>
      </TouchableOpacity>

    </View>
  )
}

export default AuthChoice
