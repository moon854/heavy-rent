import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import UserProfile from '../../components/UserProfile';
import { useTheme } from '../../contexts/ThemeContext';

const Chat = ({ navigation }) => {
  const [message, setMessage] = useState("")
  const user = useSelector((state) => state.home.user);
  const { colors, isDark } = useTheme();

  const sendMessage = () => {
    alert("Message Sent: " + message)
    setMessage("")
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <UserProfile 
          size="small" 
          showName={false}
          imageStyle={{ marginLeft: 10 }}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>Heavyrent</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Fast, practical and quality</Text>
        </View>
        <Feather name="phone" size={22} color={colors.primary} />
      </View>

      {/* Messages */}
      <View style={{ flex: 1, padding: 15, backgroundColor: colors.background }}>
        {/* Received Message */}
        <View style={{ alignSelf: "flex-start", backgroundColor: colors.card, padding: 10, borderRadius: 10, marginBottom: 5, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.textPrimary }}>This message is made automatically!{"\n"}Please give a question!</Text>
        </View>
        <Text style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 10 }}>02.30 PM</Text>

        {/* Sent Message */}
        <View style={{ alignSelf: "flex-end", backgroundColor: colors.primary + '20', padding: 10, borderRadius: 10, marginBottom: 5 }}>
          <Text style={{ color: colors.textPrimary }}>Is the unit still available?</Text>
        </View>
        <Text style={{ fontSize: 10, color: colors.textSecondary, textAlign: "right" }}>Read  02.35 PM</Text>
      </View>

      {/* Input Field */}
      <View style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, padding: 10, backgroundColor: colors.card }}>
        <TextInput
          style={{ 
            flex: 1, 
            borderWidth: 1, 
            borderColor: colors.border, 
            borderRadius: 20, 
            paddingHorizontal: 15, 
            marginRight: 10,
            backgroundColor: colors.background,
            color: colors.textPrimary
          }}
          placeholder="Type Your Message ..."
          placeholderTextColor={colors.textSecondary}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Feather name="send" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Chat
