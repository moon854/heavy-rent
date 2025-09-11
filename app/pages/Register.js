import AntDesign from '@expo/vector-icons/AntDesign';

import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { handleSignUp } from '../Helper/firebaseHelper';
import { setUser } from '../redux/Slices/HomeDataSlice';


const Register = ({ navigation }) => {
  const [Name, setName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [YourEmail, setYourEmail] = useState("");
  const dispatch = useDispatch();



  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();



  const goToRigester = async () => {

    const user = await handleSignUp(
      email,
      password,
      { role: "user", firstName, email, phone, password }
    )

    if (user?.uid) {
      dispatch(setUser(user))
    } else {
      alert("Error in sign up")
    }
    
    
  }






  return (
    <ScrollView style={{ Height: "100%" }}>
    <View>

      <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 10 }}>
        Create Account
      </Text>

      <TextInput onChangeText={(e) => setFirstName(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Enter Your Name " />
      <TextInput onChangeText={(e) => setEmail(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Your Email" />
      <TextInput onChangeText={(e) => setPassword(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Password" />
      <TextInput onChangeText={(e) => setConfirmPassword(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Confirm Password" />





      <View>
        <Text style={{ fontSize: 12, color: 'black', textAlign: 'center', paddingTop: 20 }}>I accept the terms and privacy policy</Text>
      </View>
      <AntDesign
        name="checkcircle"
        size={18}
        color="#47D6FF"
        style={{ marginLeft: 60, marginTop: -16 }}
      />

      <TouchableOpacity onPress={goToRigester} style={{ width: "50%", height: 50, backgroundColor: "#47D6FF", alignSelf: 'center', borderRadius: 10, marginTop: 40 }}>


        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', paddingTop: 10 }}>
          Register
        </Text>
      </TouchableOpacity>
      
    </View>
    </ScrollView>
  )
}

export default Register