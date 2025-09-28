import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import UserProfile from '../../components/UserProfile';

const Chat = ({ navigation }) => {
  const [message, setMessage] = useState("")
  const user = useSelector((state) => state.home.user);

  const sendMessage = () => {
    alert("Message Sent: " + message)
    setMessage("")
  }

  return (
    <>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
        <Entypo name="chevron-left" size={24} color="black" onPress={() => navigation.goBack()} />
        <UserProfile 
          size="small" 
          showName={false}
          imageStyle={{ marginLeft: 10 }}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Heavyrent</Text>
          <Text style={{ fontSize: 12, color: "gray" }}>Fast, practical and quality</Text>
        </View>
        <Feather name="phone" size={22} color="#47D6FF" />
      </View>

      {/* Messages */}
      <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
        {/* Received Message */}
        <View style={{ alignSelf: "flex-start", backgroundColor: "#f2f2f2", padding: 10, borderRadius: 10, marginBottom: 5 }}>
          <Text>This message is made automatically!{"\n"}Please give a question!</Text>
        </View>
        <Text style={{ fontSize: 10, color: "gray", marginBottom: 10 }}>02.30 PM</Text>

        {/* Sent Message */}
        <View style={{ alignSelf: "flex-end", backgroundColor: "#e6f7ff", padding: 10, borderRadius: 10, marginBottom: 5 }}>
          <Text>Is the unit still available?</Text>
        </View>
        <Text style={{ fontSize: 10, color: "gray", textAlign: "right" }}>Read  02.35 PM</Text>
      </View>

      {/* Input Field */}
      <View style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: "#ddd", padding: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, marginRight: 10 }}
          placeholder="Type Your Message ..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Feather name="send" size={22} color="#47D6FF" />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Chat
