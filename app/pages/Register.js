import AntDesign from '@expo/vector-icons/AntDesign';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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



  const goToRigester = async () => {

    if (firstName === ""  || email === "" || password === "" || confirmPassword === "" || imageUrl === "") {
      alert("Please fill all the fields")
      return
    }

    const user = await handleSignUp(
      email,
      password,
      { role: "user", firstName, email, phone, password, imageUrl }
    )

    if (user?.uid) {
      dispatch(setUser(user))
    } else {
      alert("Error in sign up")
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