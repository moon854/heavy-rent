import React from 'react';
import { Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const Register = ({ navigation }) => {


  const goToLogin = () => {
    navigation.navigate("Verification");

  }


  return (
    <View>
       
      <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 10 }}>
        Create Account
      </Text>
      <TextInput style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Your Email" />
      <TextInput style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Phone Number" />
      <TextInput style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Password" />
      <TextInput style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Confirm Password" />



<View>
  <Text style={{ fontSize: 12, color: 'black', textAlign: 'center', paddingTop: 20 }}>I accept the terms and privacy policy</Text>
</View>
<AntDesign
  name="checkcircle"
  size={18}
  color="#47D6FF"
  style={{ marginLeft: 60, marginTop: -16  }} 
/>
      <TouchableOpacity onPress={goToLogin} style={{ width: "50%", height: 50, backgroundColor: "#47D6FF", alignSelf: 'center', borderRadius: 10, marginTop: 40 }}>
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', paddingTop: 10 }}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Register