import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import { handleSignUp, sendPhoneOTP } from '../Helper/firebaseHelper';


const Register = ({ navigation }) => {




  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState(false)
  const [verifyPhone, setVerifyPhone] = useState(false)
  const [cnic, setCnic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [phoneVerificationId, setPhoneVerificationId] = useState(null)
  const [phoneError, setPhoneError] = useState(false)

  // Function to format CNIC in Pakistani format (XXXXX-XXXXXXX-X)
  const formatCNIC = (text) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '')
    
    // Limit to 13 digits
    const limitedDigits = digits.slice(0, 13)
    
    // Format: XXXXX-XXXXXXX-X
    if (limitedDigits.length <= 5) {
      return limitedDigits
    } else if (limitedDigits.length <= 12) {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5)}`
    } else {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5, 12)}-${limitedDigits.slice(12)}`
    }
  }

  const handleCNICChange = (text) => {
    const formatted = formatCNIC(text)
    setCnic(formatted)
  }

  // Function to format phone number in Pakistani domestic format (0 3XX XXXXXXX)
  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '')
    
    // Limit to 11 digits
    const limitedDigits = digits.slice(0, 11)
    
    // Format: 0 3XX XXXXXXX
    if (limitedDigits.length === 0) {
      return ''
    } else if (limitedDigits.length <= 1) {
      return limitedDigits
    } else if (limitedDigits.length <= 4) {
      return `${limitedDigits.slice(0, 1)} ${limitedDigits.slice(1)}`
    } else {
      return `${limitedDigits.slice(0, 1)} ${limitedDigits.slice(1, 4)} ${limitedDigits.slice(4)}`
    }
  }

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text)
    setPhone(formatted)
    
    // Check if digits exceed 11
    const digits = text.replace(/\D/g, '')
    if (digits.length > 11) {
      setPhoneError(true)
    } else {
      setPhoneError(false)
    }
  }



  const goToRigester = async () => {

    if (firstName === ""  || email === "" || phone === "" || password === "" || confirmPassword === "" || cnic === "") {
      alert("Please fill all the fields")
      return
    }

    if (!acceptTerms) {
      alert("Please accept the terms and privacy policy to continue")
      return
    }

    if (!verifyEmail && !verifyPhone) {
      alert("Please select at least one verification method (Email or Phone)")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Create user account without imageUrl
      // Only send email verification if email verification is selected
      const user = await handleSignUp(
        email,
        password,
        { role: "user", firstName, lastName, email, phone, cnic, isVerified: false },
        verifyEmail // Pass verifyEmail flag to control email verification sending
      )

      if (user?.uid) {
        // If only phone verification is selected
        if (verifyPhone && !verifyEmail) {
          try {
            const phoneResult = await sendPhoneOTP(phone)
            if (phoneResult.success) {
              setIsLoading(false)
              // Redirect to Verification page
              navigation.navigate('Verification', { 
                verificationId: phoneResult.verificationId,
                phoneNumber: phone,
                email: null
              })
              return
            } else {
              alert('Failed to send OTP. Please try again.')
              setIsLoading(false)
              return
            }
          } catch (phoneError) {
            console.error("Phone OTP error:", phoneError)
            alert(`Phone verification failed: ${phoneError.message || 'Failed to send OTP'}`)
            setIsLoading(false)
            return
          }
        }
        
        // If only email verification is selected
        if (verifyEmail && !verifyPhone) {
          let messages = []
          if (user.verificationEmailSent === false) {
            messages.push(`Email verification: ${user.verificationError || 'Failed to send verification email'}`)
          } else {
            messages.push(`Verification link has been sent to ${email}`)
          }
          setVerificationMessage(messages.join('\n'))
          setShowVerificationModal(true)
          return
        }
        
        // If both are selected
        if (verifyEmail && verifyPhone) {
          let messages = []
          
          // Send email verification
          if (user.verificationEmailSent === false) {
            messages.push(`Email verification: ${user.verificationError || 'Failed to send verification email'}`)
          } else {
            messages.push(`Verification link has been sent to ${email}`)
          }
          
          // Send phone OTP
          try {
            const phoneResult = await sendPhoneOTP(phone)
            if (phoneResult.success) {
              messages.push(`OTP code has been sent to ${phoneResult.phoneNumber}`)
              // Redirect to Verification page for phone OTP
              setIsLoading(false)
              navigation.navigate('Verification', { 
                verificationId: phoneResult.verificationId,
                phoneNumber: phone,
                email: email
              })
              return
            } else {
              messages.push(`Phone verification: Failed to send OTP`)
            }
          } catch (phoneError) {
            console.error("Phone OTP error:", phoneError)
            messages.push(`Phone verification: ${phoneError.message || 'Failed to send OTP'}`)
          }
          
          // Show modal with both messages
          setVerificationMessage(messages.join('\n'))
          setShowVerificationModal(true)
        }
        
      } else {
        alert("Error in sign up")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = error?.message || "Error in sign up";
      alert(`Sign up failed: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowVerificationModal(false)
    setIsLoading(false)
    navigation.navigate('Login')
  }




  return (
    <ScrollView style={{ Height: "100%" }}>
      <View>

        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 10 }}>
          Create Account
        </Text>

        <TextInput onChangeText={(e) => setFirstName(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Enter Your Name " />
        <TextInput onChangeText={(e) => setEmail(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Your Email" keyboardType="email-address" autoCapitalize="none" />
        <TextInput 
          onChangeText={handlePhoneChange} 
          value={phone}
          maxLength={14}
          keyboardType="phone-pad" 
          style={{ 
            borderColor: phoneError ? "#ff0000" : "#47D6FF", 
            borderWidth: 1, 
            width: "80%", 
            height: 50, 
            alignSelf: 'center', 
            borderRadius: 10, 
            marginTop: 40, 
            backgroundColor: phoneError ? "#ffe6e6" : "white", 
            paddingLeft: 10 
          }} 
          placeholder="Phone Number (0 3XX XXXXXXX)" 
        />
        {phoneError && (
          <Text style={{ color: "#ff0000", fontSize: 12, width: "80%", alignSelf: 'center', marginTop: 5 }}>
            Phone number should be 11 digits (0 3XX XXXXXXX)
          </Text>
        )}
        <TextInput 
          onChangeText={handleCNICChange} 
          value={cnic}
          maxLength={15}
          keyboardType="numeric"
          style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} 
          placeholder="CNIC (12345-1234567-1)" 
        />
        <TextInput onChangeText={(e) => setPassword(e)} secureTextEntry style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Password" />
        <TextInput onChangeText={(e) => setConfirmPassword(e)} secureTextEntry style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Confirm Password" />

        {/* Verification Options */}
        <View style={{ width: "80%", alignSelf: 'center', marginTop: 30 }}>
          <Text style={{ fontSize: 14, color: 'black', marginBottom: 10, fontWeight: '600' }}>
            Verification Method (Select at least one):
          </Text>
          
          <TouchableOpacity 
            onPress={() => setVerifyEmail(!verifyEmail)}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
          >
            <AntDesign
              name={verifyEmail ? "checkcircle" : "checkcircleo"}
              size={18}
              color={verifyEmail ? "#47D6FF" : "#ccc"}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 12, color: 'black' }}>
              Send verification link to Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setVerifyPhone(!verifyPhone)}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
          >
            <AntDesign
              name={verifyPhone ? "checkcircle" : "checkcircleo"}
              size={18}
              color={verifyPhone ? "#47D6FF" : "#ccc"}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 12, color: 'black' }}>
              Send OTP code to Phone Number
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => setAcceptTerms(!acceptTerms)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
        >
          <AntDesign
            name={acceptTerms ? "checkcircle" : "checkcircleo"}
            size={18}
            color={acceptTerms ? "#47D6FF" : "#ccc"}
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 12, color: 'black', textAlign: 'center' }}>
            I accept the terms and privacy policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={goToRigester} 
          disabled={isLoading || !acceptTerms || (!verifyEmail && !verifyPhone)}
          style={{ 
            width: "50%", 
            height: 50, 
            backgroundColor: acceptTerms && !isLoading && (verifyEmail || verifyPhone) ? "#47D6FF" : "#ccc", 
            alignSelf: 'center', 
            borderRadius: 10, 
            marginTop: 40,
            opacity: acceptTerms && (verifyEmail || verifyPhone) ? 1 : 0.6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
              Register
            </Text>
          )}
        </TouchableOpacity>

        {/* Verification Modal */}
        <Modal
          visible={showVerificationModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 20, width: '80%', maxWidth: 400 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', marginBottom: 15, textAlign: 'center' }}>
                Verification Codes Sent!
              </Text>
              <Text style={{ fontSize: 14, color: 'black', marginBottom: 20, textAlign: 'center', lineHeight: 20 }}>
                {verificationMessage}
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginBottom: 20, textAlign: 'center', fontStyle: 'italic' }}>
                Please verify your account before logging in. You will be redirected to the login page.
              </Text>
              <TouchableOpacity 
                onPress={handleCloseModal}
                style={{
                  backgroundColor: "#47D6FF",
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Go to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  )
}

export default Register
