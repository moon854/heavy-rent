import AntDesign from '@expo/vector-icons/AntDesign';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { handleSignUp, uploadImageToCloudinary, resendVerificationEmail } from '../Helper/firebaseHelper';

import * as ImagePicker from 'expo-image-picker';


const Register = ({ navigation }) => {




  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [imageUrl, setImageUrl] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [cnic, setCnic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

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



  const goToRigester = async () => {

    if (firstName === ""  || email === "" || phone === "" || password === "" || confirmPassword === "" || imageUrl === "" || cnic === "") {
      alert("Please fill all the fields")
      return
    }

    if (!acceptTerms) {
      alert("Please accept the terms and privacy policy to continue")
      return
    }

    setIsLoading(true)

    try {
      const user = await handleSignUp(
        email,
        password,
        { role: "user", firstName, lastName, email, phone, password, imageUrl, cnic }
      )

      if (user?.uid) {
        // Don't set user in Redux - user needs to verify email first
        // User will be set in Redux only after successful login with verified email
        
        // Check if verification email was sent
        if (user.verificationEmailSent === false) {
          alert(`Account created! However, there was an issue sending the verification email: ${user.verificationError || 'Unknown error'}. Please check your email settings or try logging in to resend the verification email.`)
        } else {
          alert("Account created successfully! A verification email has been sent to your inbox. Please check your email (including spam folder) and click the verification link, then log in.")
        }
        navigation.navigate('Login')
      } else {
        alert("Error in sign up")
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = error?.message || "Error in sign up";
      alert(`Sign up failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }


  const handleImagePicker = async () => {
    try {
      setIsUploadingImage(true)

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        const uploadedImageUrl = await uploadImageToCloudinary(imageUri)
        setImageUrl(uploadedImageUrl)
      }
    } catch (error) {
      console.log("Error picking image:", error);
    } finally {
      setIsUploadingImage(false)
    }
  }






  return (
    <ScrollView style={{ Height: "100%" }}>
      <View>

        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 10 }}>
          Create Account
        </Text>


        <TouchableOpacity onPress={handleImagePicker} disabled={isUploadingImage}>
          <View style={{ width: 100, height: 100, borderRadius: 50, alignSelf: "center", backgroundColor: "#47D6FF", marginTop: 10, alignItems: "center", justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>

    
            {isUploadingImage ? (
              <ActivityIndicator size="large" color="white" />
            ) : imageUrl != "" ? (
              <Image 
                source={{ uri: imageUrl }} 
                style={{ width: 100, height: 100, borderRadius: 50 }} 
              />
            ) : (
              <FontAwesome6 name="image" size={24} color="black" />
            )}
          </View>
        </TouchableOpacity>

        <TextInput onChangeText={(e) => setFirstName(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Enter Your Name " />
        <TextInput onChangeText={(e) => setEmail(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Your Email" keyboardType="email-address" autoCapitalize="none" />
        <TextInput onChangeText={(e) => setPhone(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Phone Number" keyboardType="phone-pad" />
        <TextInput 
          onChangeText={handleCNICChange} 
          value={cnic}
          maxLength={15}
          keyboardType="numeric"
          style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} 
          placeholder="CNIC (12345-1234567-1)" 
        />
        <TextInput onChangeText={(e) => setPassword(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Password" />
        <TextInput onChangeText={(e) => setConfirmPassword(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Confirm Password" />





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
          disabled={isLoading || imageUrl === "" || !acceptTerms}
          style={{ 
            width: "50%", 
            height: 50, 
            backgroundColor: acceptTerms && !isLoading && imageUrl !== "" ? "#47D6FF" : "#ccc", 
            alignSelf: 'center', 
            borderRadius: 10, 
            marginTop: 40,
            opacity: acceptTerms && imageUrl !== "" ? 1 : 0.6,
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

      </View>
    </ScrollView>
  )
}

export default Register