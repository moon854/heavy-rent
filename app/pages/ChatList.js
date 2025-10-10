import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';

const ChatList = ({ navigation }) => {
  const [generalChats, setGeneralChats] = useState([]);
  const [adChats, setAdChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state?.home?.user) || {};
  const { colors, isDark } = useTheme();
  const userId = user?.uid || user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Listen to all chat messages for this user (simplified query to avoid index requirement)
    const messagesQuery = query(
      collection(db, 'chatMessages')
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const generalChatsData = [];
      const adChatsData = [];
      const generalChatIds = new Set();
      const adChatIds = new Set();
      
      let unreadMessages = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Check if this message involves the current user (sender, recipientId, or chatId includes user)
        const isUserMessage = data.senderId === userId || 
                             data.recipientId === userId || 
                             data.chatId?.includes(userId);
        
        // Count unread messages from admin to this user
        if (data.recipientId === userId && data.senderType === 'admin' && data.status !== 'read') {
          unreadMessages++;
        }
        
        if (isUserMessage) {
          if (data.machineryDetails) {
            // Ad-specific chat
            if (!adChatIds.has(data.chatId)) {
              adChatIds.add(data.chatId);
              adChatsData.push({
                id: data.chatId,
                lastMessage: data.message,
                lastMessageTime: data.createdAt,
                machineryDetails: data.machineryDetails,
                chatType: 'ad'
              });
            }
          } else {
            // General chat - only show if it's actually a general chat (not machinery related)
            if (!generalChatIds.has(data.chatId) && !data.chatId?.includes('machinery_')) {
              generalChatIds.add(data.chatId);
              generalChatsData.push({
                id: data.chatId,
                lastMessage: data.message,
                lastMessageTime: data.createdAt,
                chatType: 'general'
              });
            }
          }
        }
      });
      
      setUnreadCount(unreadMessages);
      
      setGeneralChats(generalChatsData);
      setAdChats(adChatsData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const openGeneralChat = () => {
    navigation.navigate('Chat', { chatType: 'general' });
  };

  const openAdChat = (chat) => {
    navigation.navigate('Chat', { 
      chatType: 'ad',
      machinery: chat.machineryDetails,
      chatId: chat.id
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: colors.textPrimary,
          marginLeft: 10
        }}>
          Chats
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* General Chat Section */}
        <View style={{ padding: 15 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 10
          }}>
            General Support
          </Text>
          
          <TouchableOpacity onPress={openGeneralChat}>
            <View style={{
              backgroundColor: colors.card,
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
                position: 'relative'
              }}>
                <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                {unreadCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: '#FF4444',
                    borderRadius: 12,
                    minWidth: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 6
                  }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: 5
                }}>
                  Chat with Admin
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary
                }}>
                  {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'General inquiries and support'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Ad-specific Chats Section */}
        <View style={{ padding: 15 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 10
          }}>
            Machinery Inquiries
          </Text>
          
          {loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>Loading chats...</Text>
            </View>
          ) : adChats.length === 0 ? (
            <View style={{
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center'
            }}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
              <Text style={{
                fontSize: 16,
                color: colors.textSecondary,
                marginTop: 10,
                textAlign: 'center'
              }}>
                No machinery inquiries yet
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 5,
                textAlign: 'center'
              }}>
                Start chatting about machinery from ad details page
              </Text>
            </View>
          ) : (
            adChats.map((chat) => (
              <TouchableOpacity key={chat.id} onPress={() => openAdChat(chat)}>
                <View style={{
                  backgroundColor: colors.card,
                  padding: 15,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: colors.primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15
                  }}>
                    <Ionicons name="construct" size={24} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.textPrimary,
                      marginBottom: 5
                    }}>
                      {chat.machineryDetails?.name || 'Machinery Inquiry'}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      marginBottom: 3
                    }}>
                      {chat.lastMessage}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.textSecondary
                    }}>
                      {formatTime(chat.lastMessageTime)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChatList;
