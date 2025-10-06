import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import UserProfile from '../../components/UserProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { notifyAdminNewMessage } from '../Helper/chatNotifications';

const Chat = ({ navigation, route }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.home.user);
  const { colors, isDark } = useTheme();
  
  // Get chat type and machinery details from route params
  const chatType = route?.params?.chatType || 'general';
  const machinery = route?.params?.machinery || null;
  const existingChatId = route?.params?.chatId || null;
  
  // Generate chat ID based on type
  const chatId = existingChatId || (chatType === 'ad' && machinery ? 
    `machinery_${machinery.id}_${user.uid}` : 
    `general_${user.uid}`);

  useEffect(() => {
    
    // Listen to real-time messages (simplified query to avoid index requirement)
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatMessages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only show messages for this specific chat
        if (data.chatId === chatId) {
          chatMessages.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      // Sort messages by creation time (client-side)
      chatMessages.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return aTime.getTime() - bTime.getTime();
      });
      
      setMessages(chatMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      const messageData = {
        chatId: chatId,
        senderId: user.uid || user.id,
        senderName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
        senderType: 'user',
        message: message.trim(),
        machineryDetails: machinery ? {
          id: machinery.id,
          name: machinery.name,
          category: machinery.categoryName || machinery.category,
          price: machinery.price,
          location: machinery.location,
          imageUrl: machinery.imageUrl || machinery.imageUrls?.[0]
        } : null,
        createdAt: serverTimestamp(),
        status: 'sent'
      };

      await addDoc(collection(db, 'chatMessages'), messageData);
      
      // Send notification to admin
      await notifyAdminNewMessage(
        user.uid || user.id,
        user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
        message.trim(),
        chatId,
        machinery
      );
      
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
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
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>
            {chatType === 'ad' && machinery ? machinery.name : 'Heavyrent Support'}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            {chatType === 'ad' && machinery ? 'Machinery Inquiry' : 'Fast, practical and quality'}
          </Text>
        </View>
        <Feather name="phone" size={22} color={colors.primary} />
      </View>

      {/* Messages */}
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ padding: 15 }}>
          {loading ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingTop: 50
            }}>
              <Text style={{ color: colors.textSecondary }}>Loading messages...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 50
            }}>
              <Feather name="message-circle" size={64} color={colors.textSecondary} />
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '600', 
                color: colors.textPrimary, 
                marginTop: 16,
                textAlign: 'center'
              }}>
                Start a Conversation
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: colors.textSecondary, 
                marginTop: 8,
                textAlign: 'center',
                lineHeight: 20
              }}>
                {chatType === 'ad' && machinery 
                  ? `Ask about "${machinery.name}" or send any inquiry to our admin team.`
                  : 'Send a message to our admin team for general support and inquiries.'
                }
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View key={msg.id} style={{ marginBottom: 15 }}>
                {msg.senderType === 'admin' ? (
                  // Admin message
                  <View style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                    <View style={{ 
                      backgroundColor: colors.card, 
                      padding: 12, 
                      borderRadius: 15, 
                      borderWidth: 1, 
                      borderColor: colors.border 
                    }}>
                      <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                        {msg.message}
                      </Text>
                    </View>
                    <Text style={{ 
                      fontSize: 11, 
                      color: colors.textSecondary, 
                      marginTop: 4,
                      marginLeft: 5
                    }}>
                      Admin • {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString() : 'Now'}
                    </Text>
                  </View>
                ) : (
                  // User message
                  <View style={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
                    <View style={{ 
                      backgroundColor: colors.primary + '20', 
                      padding: 12, 
                      borderRadius: 15 
                    }}>
                      <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                        {msg.message}
                      </Text>
                    </View>
                    <Text style={{ 
                      fontSize: 11, 
                      color: colors.textSecondary, 
                      marginTop: 4,
                      marginRight: 5,
                      textAlign: 'right'
                    }}>
                      You • {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString() : 'Now'}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

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
