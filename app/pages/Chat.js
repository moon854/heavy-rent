import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import UserProfile from '../../components/UserProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { notifyAdminNewMessage } from '../Helper/chatNotifications';

const Chat = ({ navigation, route }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state?.home?.user) || {};
  const { colors, isDark } = useTheme();
  
  // Get chat type and machinery details from route params
  const chatType = route?.params?.chatType || 'general';
  const machinery = route?.params?.machinery || null;
  const existingChatId = route?.params?.chatId || null;
  
  // Generate chat ID based on type
  const userId = user?.uid || user?.id;
  const chatId = existingChatId || (chatType === 'ad' && machinery ? 
    `machinery_${machinery.id}_${userId}` : 
    `general_${userId}`);

  useEffect(() => {
    
    // Listen to real-time messages (simplified query to avoid index requirement)
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatMessages = [];
      
      console.log('🔍 Chat Debug - Current User ID:', userId);
      console.log('🔍 Chat Debug - Current Chat ID:', chatId);
      console.log('🔍 Chat Debug - Total messages in DB:', querySnapshot.size);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Log all messages for debugging
        console.log('📨 Message:', {
          id: doc.id,
          chatId: data.chatId,
          recipientId: data.recipientId,
          type: data.type,
          senderType: data.senderType,
          message: data.message?.substring(0, 50)
        });
        
        // STRICT: Show messages ONLY for this specific chatId
        if (data.chatId === chatId) {
          console.log('✅ Message matched for this chat!');
          chatMessages.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      console.log('💬 Total messages to display:', chatMessages.length);
      
      // Sort messages by creation time (client-side)
      chatMessages.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return aTime.getTime() - bTime.getTime();
      });
      
      setMessages(chatMessages);
      setLoading(false);

      // Mark admin messages as read
      const unreadAdminMessages = chatMessages.filter(
        msg => msg.recipientId === userId && msg.senderType === 'admin' && msg.status !== 'read'
      );

      if (unreadAdminMessages.length > 0) {
        // Mark messages as read in background
        unreadAdminMessages.forEach(async (msg) => {
          try {
            await updateDoc(doc(db, 'chatMessages', msg.id), {
              status: 'read',
              readAt: serverTimestamp()
            });
          } catch (error) {
            console.error('Error marking message as read:', error);
          }
        });
      }
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
        senderId: userId,
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
      const machineryDetails = machinery ? {
        id: machinery.id,
        name: machinery.name,
        category: machinery.categoryName || machinery.category,
        price: machinery.price,
        location: machinery.location,
        imageUrl: machinery.imageUrl || machinery.imageUrls?.[0]
      } : null;
      
      await notifyAdminNewMessage(
        userId,
        user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
        message.trim(),
        chatId,
        machineryDetails
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
                  <View style={{ alignSelf: 'flex-start', maxWidth: '95%' }}>
                    {msg.type === 'request_approved_card' && msg.requestCard ? (
                      // Approved Request Summary Card
                      <View>
                        <View style={{ 
                          backgroundColor: colors.card, 
                          padding: 12, 
                          borderRadius: 15, 
                          borderWidth: 1, 
                          borderColor: colors.border,
                          marginBottom: 10
                        }}>
                          <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                            {msg.message}
                          </Text>
                        </View>

                        {/* Request Summary Card */}
                        <View style={{ 
                          backgroundColor: '#4CAF5010',
                          borderRadius: 12,
                          padding: 15,
                          borderWidth: 2,
                          borderColor: '#4CAF50'
                        }}>
                          <Text style={{ fontSize: 16, fontWeight: '700', color: '#4CAF50', marginBottom: 12, textAlign: 'center' }}>
                            ✅ Rental Request Approved
                          </Text>

                          {/* Machinery Details */}
                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 10 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 5 }}>Machinery:</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>
                              {msg.requestCard.machineryName}
                            </Text>
                          </View>

                          {/* Rental Info */}
                          <View style={{ backgroundColor: '#47D6FF10', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#47D6FF', marginBottom: 8 }}>
                              📅 Rental Information
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary, marginBottom: 3 }}>
                              • Start Date: {msg.requestCard.rentalStartDate}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary, marginBottom: 3 }}>
                              • Duration: {msg.requestCard.rentalDuration} ({msg.requestCard.numberOfDays} days)
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Delivery: {msg.requestCard.deliveryLocation}
                            </Text>
                          </View>

                          {/* Payment Details */}
                          <View style={{ backgroundColor: '#FFF3CD', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#856404', marginBottom: 8 }}>
                              💰 Payment Summary
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                              <Text style={{ fontSize: 12, color: '#856404' }}>Rent/Day:</Text>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#856404' }}>Rs. {msg.requestCard.rentPerDay?.toLocaleString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                              <Text style={{ fontSize: 12, color: '#856404' }}>Total Rent:</Text>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#856404' }}>Rs. {msg.requestCard.totalRent?.toLocaleString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                              <Text style={{ fontSize: 12, color: '#856404' }}>Security Deposit:</Text>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#856404' }}>Rs. {msg.requestCard.securityDeposit?.toLocaleString()}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: '#856404', marginVertical: 6 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                              <Text style={{ fontSize: 13, fontWeight: '700', color: '#856404' }}>Advance Paid:</Text>
                              <Text style={{ fontSize: 13, fontWeight: '700', color: '#4CAF50' }}>Rs. {msg.requestCard.advancePayment?.toLocaleString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ fontSize: 12, color: '#856404' }}>Remaining:</Text>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#FF9800' }}>Rs. {msg.requestCard.remainingPayment?.toLocaleString()}</Text>
                            </View>
                          </View>

                          {/* Status Badge */}
                          <View style={{ 
                            backgroundColor: '#4CAF50', 
                            borderRadius: 8, 
                            padding: 10,
                            alignItems: 'center'
                          }}>
                            <Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>
                              ✓ Request ID: {msg.requestCard.requestId?.substring(0, 8)}...
                            </Text>
                          </View>
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
                    ) : msg.type === 'renter_card' && msg.renterCard ? (
                      // Renter Card Display (for publisher)
                      <View>
                        <View style={{ 
                          backgroundColor: colors.card, 
                          padding: 12, 
                          borderRadius: 15, 
                          borderWidth: 1, 
                          borderColor: colors.border,
                          marginBottom: 10
                        }}>
                          <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                            {msg.message}
                          </Text>
                        </View>

                        {/* Renter Card */}
                        <View style={{ 
                          backgroundColor: '#4CAF5010',
                          borderRadius: 12,
                          padding: 15,
                          borderWidth: 2,
                          borderColor: '#4CAF50'
                        }}>
                          <Text style={{ fontSize: 16, fontWeight: '700', color: '#4CAF50', marginBottom: 12, textAlign: 'center' }}>
                            👤 Renter Details
                          </Text>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Machinery Rented:</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                              {msg.renterCard.machineryName}
                            </Text>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Renter Name:</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                              {msg.renterCard.renterName}
                            </Text>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="call" size={16} color="#4CAF50" style={{ marginRight: 8 }} />
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Phone:</Text>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                                  {msg.renterCard.renterPhone}
                                </Text>
                              </View>
                              <TouchableOpacity 
                                onPress={() => Linking.openURL(`tel:${msg.renterCard.renterPhone}`)}
                                style={{ 
                                  backgroundColor: '#4CAF50',
                                  paddingHorizontal: 12,
                                  paddingVertical: 6,
                                  borderRadius: 6
                                }}
                              >
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Call</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                              <Ionicons name="location" size={16} color="#4CAF50" style={{ marginRight: 8, marginTop: 2 }} />
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Address:</Text>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary, lineHeight: 18 }}>
                                  {msg.renterCard.renterAddress}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={{ marginTop: 10, backgroundColor: '#47D6FF15', borderRadius: 8, padding: 12 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 5 }}>Rental Details:</Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Start Date: {msg.renterCard.rentalStartDate}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Duration: {msg.renterCard.rentalDuration}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Delivery: {msg.renterCard.deliveryLocation}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Project Type: {msg.renterCard.projectType}
                            </Text>
                            {msg.renterCard.operatorRequired && (
                              <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                                • Operator Required: {msg.renterCard.operatorRequired}
                              </Text>
                            )}
                          </View>

                          <View style={{ 
                            backgroundColor: '#FFF3CD', 
                            borderRadius: 8, 
                            padding: 12, 
                            marginTop: 10,
                            borderLeftWidth: 3,
                            borderLeftColor: '#FFC107'
                          }}>
                            <Text style={{ fontSize: 12, color: '#856404', fontWeight: '600' }}>
                              💡 Please contact the renter to arrange delivery and finalize details.
                            </Text>
                          </View>
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
                    ) : msg.type === 'publisher_card' && msg.publisherCard ? (
                      // Publisher Card Display
                      <View>
                        <View style={{ 
                          backgroundColor: colors.card, 
                          padding: 12, 
                          borderRadius: 15, 
                          borderWidth: 1, 
                          borderColor: colors.border,
                          marginBottom: 10
                        }}>
                          <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                            {msg.message}
                          </Text>
                        </View>

                        {/* Publisher Card */}
                        <View style={{ 
                          backgroundColor: '#47D6FF10',
                          borderRadius: 12,
                          padding: 15,
                          borderWidth: 2,
                          borderColor: '#47D6FF'
                        }}>
                          <Text style={{ fontSize: 16, fontWeight: '700', color: '#47D6FF', marginBottom: 12, textAlign: 'center' }}>
                            📋 Machinery Owner Details
                          </Text>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Machinery:</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                              {msg.publisherCard.machineryName}
                            </Text>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Owner Name:</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                              {msg.publisherCard.ownerName}
                            </Text>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="call" size={16} color="#47D6FF" style={{ marginRight: 8 }} />
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Phone:</Text>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                                  {msg.publisherCard.ownerPhone}
                                </Text>
                              </View>
                              <TouchableOpacity 
                                onPress={() => Linking.openURL(`tel:${msg.publisherCard.ownerPhone}`)}
                                style={{ 
                                  backgroundColor: '#4CAF50',
                                  paddingHorizontal: 12,
                                  paddingVertical: 6,
                                  borderRadius: 6
                                }}
                              >
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Call</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <MaterialIcons name="credit-card" size={16} color="#47D6FF" style={{ marginRight: 8 }} />
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>CNIC:</Text>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                                  {msg.publisherCard.ownerCNIC}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                              <Ionicons name="location" size={16} color="#47D6FF" style={{ marginRight: 8, marginTop: 2 }} />
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Address:</Text>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary, lineHeight: 18 }}>
                                  {msg.publisherCard.ownerAddress}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={{ marginTop: 10, backgroundColor: '#4CAF5015', borderRadius: 8, padding: 12 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 5 }}>Rental Details:</Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Start Date: {msg.publisherCard.rentalStartDate}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Duration: {msg.publisherCard.rentalDuration}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                              • Delivery: {msg.publisherCard.deliveryLocation}
                            </Text>
                          </View>
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
                      // Regular Admin Message
                      <View>
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
                    )}
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
