import AntDesign from '@expo/vector-icons/AntDesign';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { handleSignUp, uploadImageToCloudinary } from '../Helper/firebaseHelper';
import { setUser } from '../redux/Slices/HomeDataSlice';

import * as ImagePicker from 'expo-image-picker';


const Register = ({ navigation }) => {




  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [cnic, setCnic] = useState("")
  const [isLoading, setIsLoading] = useState(false)



  const goToRigester = async () => {

    if (firstName === ""  || email === "" || password === "" || confirmPassword === "" || imageUrl === "" || cnic === "") {
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
        dispatch(setUser(user))
        alert("Account created successfully!")
      } else {
        alert("Error in sign up")
      }
    } catch (error) {
      alert("Error in sign up")
    } finally {
      setIsLoading(false)
    }
  }


  const handleImagePicker = async () => {


    try {

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

    }

  }






  return (
    <ScrollView style={{ Height: "100%" }}>
      <View>

        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 10 }}>
          Create Account
        </Text>


        <TouchableOpacity onPress={handleImagePicker}>
          <View style={{ width: 100, height: 100, borderRadius: 50, alignSelf: "center", backgroundColor: "#47D6FF", marginTop: 10, alignItems: "center", justifyContent: 'center' }}>

    
            {imageUrl != "" ?

              <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 , borderRadius:50 }} />

              : <FontAwesome6 name="image" size={24} color="black" />

            }
          </View>
        </TouchableOpacity>

        <TextInput onChangeText={(e) => setFirstName(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Enter Your Name " />
        <TextInput onChangeText={(e) => setEmail(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="Your Email" />
        <TextInput onChangeText={(e) => setCnic(e)} style={{ borderColor: "#47D6FF", borderWidth: 1, width: "80%", height: 50, alignSelf: 'center', borderRadius: 10, marginTop: 40, backgroundColor: "white", paddingLeft: 10 }} placeholder="CNIC (12345-1234567-1)" />
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
          disabled={isLoading}
          style={{ 
            width: "50%", 
            height: 50, 
            backgroundColor: acceptTerms && !isLoading ? "#47D6FF" : "#ccc", 
            alignSelf: 'center', 
            borderRadius: 10, 
            marginTop: 40,
            opacity: acceptTerms ? 1 : 0.6,
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