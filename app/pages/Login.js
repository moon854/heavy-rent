import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { LoginWithFBase, getDataById, resendVerificationEmail, syncEmailVerificationStatus } from '../Helper/firebaseHelper';
import { auth } from '../../firebase';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { setUser } from '../redux/Slices/HomeDataSlice';

const Login = ({ navigation }) => {

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [isResending, setIsResending] = useState(false);
    const handleLoginWithEmail = async () => {
      setIsLoading(true)
      
      try {
        const authUser = await LoginWithFBase(
          email,
          password,
        )
    
        if (authUser?.uid) {
          // Fetch complete user data from Firestore first
          const userData = await getDataById("users", authUser.uid);
          
          if (!userData) {
            alert("User data not found");
            try { await signOut(auth); } catch {}
            setIsLoading(false);
            return;
          }

          // Check if user is verified either in Firebase Auth OR in Firestore (admin verified)
          // If admin has verified user in Firestore (isVerified: true), allow login even if Firebase Auth email is not verified
          const isVerified = authUser.emailVerified || userData.isVerified === true;
          
          if (!isVerified) {
            // Automatically try to resend verification email for old accounts
            try {
              console.log('User not verified, attempting to resend verification email...');
              await sendEmailVerification(authUser);
              console.log('✅ Verification email sent automatically');
              setShowResendOption(true);
              alert('Your email is not verified. We have automatically sent you a verification email. Please check your inbox (including spam folder) for the verification link. If you did not receive the email, please click the "Resend Verification Email" button below.');
            } catch (verifyError) {
              console.error('Error sending verification email:', verifyError);
              setShowResendOption(true);
              alert('Your email is not verified. Please click the "Resend Verification Email" button below or contact admin for manual verification.');
            }
            
            try { await signOut(auth); } catch {}
            setIsLoading(false);
            return;
          }
          
          setShowResendOption(false);
          
          // Sync Firebase Auth emailVerified status with Firestore
          // If user verified their email in Firebase Auth, automatically update Firestore
          if (authUser.emailVerified && !userData.isVerified) {
            console.log('Email verified in Firebase Auth, syncing with Firestore...');
            try {
              await syncEmailVerificationStatus(authUser.uid, authUser);
              // Refetch user data to get updated status
              const updatedUserData = await getDataById("users", authUser.uid);
              if (updatedUserData) {
                dispatch(setUser(updatedUserData));
              } else {
                dispatch(setUser(userData));
              }
            } catch (syncError) {
              console.error('Error syncing verification status:', syncError);
              dispatch(setUser(userData));
            }
          } else if (userData.isVerified === true && !authUser.emailVerified) {
            // If Firestore says verified but Firebase Auth doesn't, allow login based on Firestore
            console.log('User verified by admin, allowing login');
            dispatch(setUser(userData));
          } else {
            dispatch(setUser(userData));
          }
          
          alert("Login successful!");
        } else {
          alert("Error in login")
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error?.message || "Error in login";
        alert(`Login failed: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    }

    const handleResendVerification = async () => {
      if (!email || !password) {
        alert("Please enter your email and password to resend verification email");
        return;
      }

      setIsResending(true);
      try {
        await resendVerificationEmail(email, password);
        alert("Verification email sent successfully! Please check your inbox (including spam folder).");
      } catch (error) {
        console.error("Resend verification error:", error);
        const errorMessage = error?.message || "Failed to resend verification email";
        alert(`Error: ${errorMessage}`);
      } finally {
        setIsResending(false);
      }
    }
  


  return (
    <View>
      <Text style={{ textAlign: 'center', marginTop: 50, fontWeight: 'bold', fontSize: 20 }}> Login Here</Text>
      <Text style={{ textAlign: 'center', marginTop: 20 }}> Welcome back, please log in again!</Text>
      <TextInput 
        onChangeText={setEmail} 
        value={email}
        style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} 
        placeholder="Enter your Email" 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        onChangeText={setPassword} 
        value={password}
        secureTextEntry
        style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} 
        placeholder="Password" 
      />
      <Text style={{ color: "#47D6FF", paddingLeft: 40, marginTop: 20 }}> Forgot Your Password?</Text>
      
      {showResendOption && (
        <TouchableOpacity 
          onPress={handleResendVerification}
          disabled={isResending || !email || !password}
          style={{ 
            marginTop: 20,
            padding: 10,
            alignItems: 'center'
          }}
        >
          <Text style={{ 
            color: isResending || !email || !password ? "#ccc" : "#47D6FF", 
            textDecorationLine: 'underline',
            fontSize: 14
          }}>
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Text>
        </TouchableOpacity>
      )}
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