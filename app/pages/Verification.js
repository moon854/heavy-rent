import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { Keyboard } from 'react-native';
const Verfication = ({navigation}) => {
    const goToLogin = () => {
        navigation.navigate("Login");

    }
  return (
    <View>
    
              <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 45, fontWeight: 'bold' }}>
                Telephone number verification
              </Text>
              <View>
<Text style={{textAlign:'center', marginTop: 28}}> We send a 4 digit verification code to your cellphone via WhatsApp </Text>
              </View>
              <OtpInput
  numberOfDigits={4}
  focusColor="green"
  focusStickBlinkingDuration={500}
  onTextChange={(text) => console.log(text)}
  onFilled={(text) => Keyboard.dismiss()}
  textInputProps={{
    accessibilityLabel: 'One-Time Password',
  }}
  theme={{
    containerStyle: {
      marginTop: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinCodeContainerStyle: {
      width: 50,
      height: 50,
      margin: 5,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#000', // Colors.black
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinCodeTextStyle: {
      fontSize: 18,
      color: '#000', // Colors.black
    },
    focusStickStyle: {
      height: 2.5,
      width: 50,
      backgroundColor: '#47D6FF', // Colors.pacepal_main_green
    },
    focusedPinCodeContainerStyle: {
      borderColor: '#47D6FF', // Colors.pacepal_main_green
    },
  }}
/>
<View>
  <Text style={{textAlign:'center', color:'#47D6FF', marginTop: 20 }}>Re-Send Code</Text>
</View>

       <TouchableOpacity onPress={goToLogin} style={{width:"50%", height:50,backgroundColor:"#47D6FF",alignSelf:'center',borderRadius:10, marginTop: 100}}>
              <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', paddingTop:7 }}>
                Verify
              </Text>
            </TouchableOpacity>
    </View>
  )
}

export default Verfication