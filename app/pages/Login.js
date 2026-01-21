import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { LoginWithFBase, getDataById, resendVerificationEmail, syncEmailVerificationStatus, forgotPassword } from '../Helper/firebaseHelper';
import { auth } from '../../firebase';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { setUser } from '../redux/Slices/HomeDataSlice';

const Login = ({ navigation }) => {

  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Find user by phone number and get their email
  const getUserEmailByPhone = async (phoneNumber) => {
    try {
      const { getDocs, collection, query, where } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      
      // Format phone number (remove +92 if present, add if not)
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = formattedPhone.substring(1);
        }
        formattedPhone = '+92' + formattedPhone;
      }
      
      // Also check with original format
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().email;
      }
      
      // Try with formatted phone
      const q2 = query(usersRef, where('phone', '==', formattedPhone));
      const querySnapshot2 = await getDocs(q2);
      
      if (!querySnapshot2.empty) {
        const userDoc = querySnapshot2.docs[0];
        return userDoc.data().email;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding user by phone:', error);
      return null;
    }
  };

  const handleLoginWithEmail = async () => {
    if (!emailOrPhone || !password) {
      alert("Please enter your email/phone and password");
      return;
    }

    setIsLoading(true)
    
    try {
      // Check if input is email or phone number
      const isEmail = emailOrPhone.includes('@');
      let userEmail = emailOrPhone;
      
      // If it's a phone number, find user's email
      if (!isEmail) {
        const foundEmail = await getUserEmailByPhone(emailOrPhone);
        if (!foundEmail) {
          alert("No account found with this phone number. Please check your phone number or try logging in with email.");
          setIsLoading(false);
          return;
        }
        userEmail = foundEmail;
      }

      const authUser = await LoginWithFBase(
        userEmail,
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

          // Check if user is verified either in Firebase Auth OR in Firestore (admin verified) OR phone verified
          // If admin has verified user in Firestore (isVerified: true), allow login even if Firebase Auth email is not verified
          // Also allow login if phone is verified
          const isVerified = authUser.emailVerified || userData.isVerified === true || userData.phoneVerified === true;
          
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
          let finalUserData = userData;
          if (authUser.emailVerified && !userData.isVerified) {
            console.log('Email verified in Firebase Auth, syncing with Firestore...');
            try {
              await syncEmailVerificationStatus(authUser.uid, authUser);
              // Refetch user data to get updated status
              const updatedUserData = await getDataById("users", authUser.uid);
              if (updatedUserData) {
                dispatch(setUser(updatedUserData));
                finalUserData = updatedUserData; // Use updated data for welcome message check
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
          
          // Send welcome message if user is verified and welcome message hasn't been sent
          if ((finalUserData.isVerified === true || finalUserData.emailVerified === true) && !finalUserData.welcomeMessageSent) {
            try {
              const chatId = `general_${authUser.uid}`;
              const userName = finalUserData.firstName ? `${finalUserData.firstName} ${finalUserData.lastName || ''}`.trim() : 'User';
              const welcomeMessage = {
                chatId: chatId,
                senderId: 'admin',
                senderName: 'Admin',
                senderType: 'admin',
                recipientId: authUser.uid,
                message: `Hello ${userName}! I'm reaching out from the admin team. How can I help you today?`,
                machineryDetails: null,
                createdAt: serverTimestamp(),
                status: 'sent'
              };
              
              await addDoc(collection(db, 'chatMessages'), welcomeMessage);
              
              // Mark welcome message as sent
              const userDocRef = doc(db, 'users', authUser.uid);
              await updateDoc(userDocRef, {
                welcomeMessageSent: true,
                welcomeMessageSentAt: serverTimestamp()
              });
              
              console.log('✅ Welcome message sent to user:', userName);
            } catch (welcomeError) {
              console.error('Error sending welcome message:', welcomeError);
              // Don't block login if welcome message fails
            }
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
      if (!emailOrPhone || !password) {
        alert("Please enter your email/phone and password to resend verification email");
        return;
      }

      // Get email if phone number was entered
      const isEmail = emailOrPhone.includes('@');
      let userEmail = emailOrPhone;
      
      if (!isEmail) {
        const foundEmail = await getUserEmailByPhone(emailOrPhone);
        if (!foundEmail) {
          alert("No account found with this phone number. Please use email to resend verification.");
          return;
        }
        userEmail = foundEmail;
      }

      setIsResending(true);
      try {
        await resendVerificationEmail(userEmail, password);
        alert("Verification email sent successfully! Please check your inbox (including spam folder).");
      } catch (error) {
        console.error("Resend verification error:", error);
        const errorMessage = error?.message || "Failed to resend verification email";
        alert(`Error: ${errorMessage}`);
      } finally {
        setIsResending(false);
      }
    }

    const handleForgotPassword = async () => {
      // Check if user has entered email/phone
      if (!emailOrPhone) {
        alert("Please enter your email or phone number to reset password");
        return;
      }

      setIsResettingPassword(true);
      try {
        // Check if input is email or phone number
        const isEmail = emailOrPhone.includes('@');
        let userEmail = emailOrPhone;
        
        // If it's a phone number, find user's email
        if (!isEmail) {
          const foundEmail = await getUserEmailByPhone(emailOrPhone);
          if (!foundEmail) {
            alert("No account found with this phone number. Please enter your email address to reset password.");
            setIsResettingPassword(false);
            return;
          }
          userEmail = foundEmail;
        }

        // Send password reset email
        await forgotPassword(userEmail);
        alert(`Password reset email has been sent to ${userEmail}. Please check your inbox (including spam folder) to reset your password.`);
      } catch (error) {
        console.error("Forgot password error:", error);
        const errorMessage = error?.message || "Failed to send password reset email";
        
        // Handle specific Firebase errors
        if (errorMessage.includes('user-not-found')) {
          alert("No account found with this email address. Please check your email or create a new account.");
        } else if (errorMessage.includes('invalid-email')) {
          alert("Invalid email address. Please enter a valid email.");
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } finally {
        setIsResettingPassword(false);
      }
    }
  


  return (
    <View>
      <Text style={{ textAlign: 'center', marginTop: 50, fontWeight: 'bold', fontSize: 20 }}> Login Here</Text>
      <Text style={{ textAlign: 'center', marginTop: 20 }}> Welcome back, please log in again!</Text>
      <TextInput 
        onChangeText={setEmailOrPhone} 
        value={emailOrPhone}
        style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} 
        placeholder="Enter your Email or Phone Number" 
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput 
        onChangeText={setPassword} 
        value={password}
        secureTextEntry
        style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} 
        placeholder="Password" 
      />
      <TouchableOpacity 
        onPress={handleForgotPassword}
        disabled={isResettingPassword}
        style={{ paddingLeft: 40, marginTop: 20 }}
      >
        <Text style={{ 
          color: isResettingPassword ? "#ccc" : "#47D6FF",
          textDecorationLine: 'underline'
        }}> 
          {isResettingPassword ? "Sending reset email..." : "Forgot Your Password?"}
        </Text>
      </TouchableOpacity>
      
      {showResendOption && (
        <TouchableOpacity 
          onPress={handleResendVerification}
          disabled={isResending || !emailOrPhone || !password}
          style={{ 
            marginTop: 20,
            padding: 10,
            alignItems: 'center'
          }}
        >
          <Text style={{ 
            color: isResending || !emailOrPhone || !password ? "#ccc" : "#47D6FF", 
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