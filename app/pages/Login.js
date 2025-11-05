import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { LoginWithFBase, getDataById } from '../Helper/firebaseHelper';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { setUser } from '../redux/Slices/HomeDataSlice';

const Login = ({ navigation }) => {

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
    const handleLoginWithEmail = async () => {
      setIsLoading(true)
      
      try {
        const authUser = await LoginWithFBase(
          email,
          password,
        )
    
        if (authUser?.uid) {
          // Block login if email not verified
          if (!authUser.emailVerified) {
            alert('Please verify your email before logging in. We have sent a verification link to your email address.');
            try { await signOut(auth); } catch {}
            setIsLoading(false);
            return;
          }
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
      } catch (error) {
        alert("Error in login")
      } finally {
        setIsLoading(false)
      }
    }
  


  return (
    <View>
      <Text style={{ textAlign: 'center', marginTop: 50, fontWeight: 'bold', fontSize: 20 }}> Login Here</Text>
      <Text style={{ textAlign: 'center', marginTop: 20 }}> Welcome back, please log in again!</Text>
      <TextInput onChangeText={setEmail} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Enter your Gmail or phone number" />
      <TextInput onChangeText={setPassword} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Password" />
      <Text style={{ color: "#47D6FF", paddingLeft: 40, marginTop: 20 }}> Forgot Your Password?</Text>
      <TouchableOpacity 
        onPress={handleLoginWithEmail} 
        disabled={isLoading}
        style={{ 
          width: "50%", 
          height: 50, 
          backgroundColor: isLoading ? "#ccc" : "#47D6FF", 
          alignSelf: 'center', 
          borderRadius: 10, 
          marginTop: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
            Login
          </Text>
        )}
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