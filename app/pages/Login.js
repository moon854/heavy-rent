import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { LoginWithFBase, getDataById } from '../Helper/firebaseHelper';
import { setUser } from '../redux/Slices/HomeDataSlice';

const Login = ({ navigation }) => {

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const handleLoginWithEmail = async () => {
  
      const authUser = await LoginWithFBase(
        email,
        password,
      )
  
      if (authUser?.uid) {
        // Fetch complete user data from Firestore
        const userData = await getDataById("users", authUser.uid);
        if (userData) {
          dispatch(setUser(userData));
          alert("Login successful!");
        } else {
          alert("User data not found");
        }
      } else {
        alert("Error in login")
      }
  
    }
  


  return (
    <View>
      <Text style={{ textAlign: 'center', marginTop: 50, fontWeight: 'bold', fontSize: 20 }}> Login Here</Text>
      <Text style={{ textAlign: 'center', marginTop: 20 }}> Welcome back, please log in again!</Text>
      <TextInput onChangeText={setEmail} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Username" />
      <TextInput onChangeText={setPassword} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Password" />
      <Text style={{ color: "#47D6FF", paddingLeft: 40, marginTop: 20 }}> Forgot Your Password?</Text>
      <TouchableOpacity onPress={handleLoginWithEmail} style={{ width: "50%", height: 50, backgroundColor: "#47D6FF", alignSelf: 'center', borderRadius: 10, marginTop: 50 }}>
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', paddingTop: 7 }}>
          Login
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <Text style={{ marginTop: 20, paddingLeft: 20 }}>Already have an account, </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            >
            <Text style={{ color: "#47D6FF", marginTop: 20 }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Login