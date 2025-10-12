import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const RentalHistory = () => {
  const { colors, isDark } = useTheme();
  const user = useSelector((state) => state?.home?.user);
  const [rentRequests, setRentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRentalHistory = async () => {
    try {
      if (!user?.uid && !user?.id) {
        console.log('❌ No user logged in');
        setLoading(false);
        return;
      }

      const userId = user?.uid || user?.id;
      console.log('🔍 Fetching rental history for user:', userId);
      console.log('👤 User object:', user);

      // Try simple query first (without orderBy to avoid index issues)
      const q = query(
        collection(db, 'rentRequests'),
        where('userId', '==', userId)
      );

      console.log('📡 Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('✅ Query executed. Documents found:', querySnapshot.size);

      const requests = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Document data:', doc.id, data);
        requests.push({
          id: doc.id,
          ...data
        });
      });

      // Sort by date on client side
      requests.sort((a, b) => {
        const dateA = a.requestedAt?.seconds || 0;
        const dateB = b.requestedAt?.seconds || 0;
        return dateB - dateA;
      });

      console.log('✅ Total fetched rental history:', requests.length, 'items');
      console.log('📋 Requests:', requests);
      setRentRequests(requests);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching rental history:', error);
      console.error('Error details:', error.message);
      alert('Error loading history: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalHistory();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRentalHistory();
    setRefreshing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore Timestamp
      if (timestamp?.toDate) {
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      // Handle string dates
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      return 'N/A';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const parseDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return null;
    
    try {
      // Try parsing common date formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const isRentalActive = (request) => {
    try {
      // If status is approved, check if rental period is still active
      if (request.status !== 'approved') {
        return false; // Only approved rentals can be active
      }

      const startDate = parseDate(request.rentalStartDate) || 
                       (request.requestedAt?.toDate ? request.requestedAt.toDate() : null);
      
      if (!startDate) return false;

      const numberOfDays = request.numberOfDays || 1;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + numberOfDays);

      const today = new Date();
      
      // Check if today is between start and end date
      return today >= startDate && today <= endDate;
    } catch (error) {
      console.error('Error checking rental status:', error);
      return false;
    }
  };

  const getRentalEndDate = (request) => {
    try {
      const startDate = parseDate(request.rentalStartDate) || 
                       (request.requestedAt?.toDate ? request.requestedAt.toDate() : null);
      
      if (!startDate) return 'N/A';

      const numberOfDays = request.numberOfDays || 1;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + numberOfDays);

      return endDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getRemainingDays = (request) => {
    try {
      const startDate = parseDate(request.rentalStartDate) || 
                       (request.requestedAt?.toDate ? request.requestedAt.toDate() : null);
      
      if (!startDate) return 0;

      const numberOfDays = request.numberOfDays || 1;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + numberOfDays);

      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'rejected':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading rental history...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {rentRequests.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50, padding: 20 }}>
            <Ionicons name="document-text-outline" size={80} color={colors.textSecondary} />
            <Text style={{ fontSize: 18, color: colors.textPrimary, marginTop: 20, textAlign: 'center', fontWeight: '600' }}>
              No Rental History Found
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 10, textAlign: 'center', lineHeight: 22 }}>
              Your rent requests will appear here after you submit a payment proof
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 15, textAlign: 'center', fontStyle: 'italic' }}>
              User ID: {user?.uid || user?.id || 'Not logged in'}
            </Text>
          </View>
        ) : (
          rentRequests.map((request, index) => {
            const isActive = isRentalActive(request);
            const remainingDays = getRemainingDays(request);
            const endDate = getRentalEndDate(request);
            
            return (
              <View key={request.id || index} style={{
                backgroundColor: colors.card,
                borderRadius: 10,
                marginBottom: 20,
                elevation: 5,
                overflow: 'hidden',
                borderWidth: isActive ? 3 : 1,
                borderColor: isActive ? '#4caf50' : colors.border
              }}>
                {/* Active Rental Banner */}
                {isActive && (
                  <View style={{
                    backgroundColor: '#4caf50',
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 6 }}>
                      🚜 CURRENTLY BORROWED - {remainingDays} {remainingDays === 1 ? 'Day' : 'Days'} Remaining
                    </Text>
                  </View>
                )}

                {/* Header */}
                <View style={{
                  backgroundColor: isActive ? '#388e3c' : colors.primary,
                  padding: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: 'bold' }}>
                    {isActive ? '🔥 Active Rental' : request.status === 'approved' ? 'Completed Rental' : 'Rental Request'}
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Ionicons 
                      name={getStatusIcon(request.status)} 
                      size={16} 
                      color={colors.textInverse} 
                    />
                    <Text style={{ 
                      color: colors.textInverse, 
                      fontSize: 12, 
                      fontWeight: '600',
                      marginLeft: 4,
                      textTransform: 'capitalize'
                    }}>
                      {request.status || 'Pending'}
                    </Text>
                  </View>
                </View>

              {/* Body */}
              <View style={{ padding: 15 }}>
                {/* Machinery Image & Name Section */}
                <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                  {/* Machinery Image */}
                  {request.machineryImages && request.machineryImages.length > 0 && request.machineryImages[0] ? (
                    <Image 
                      source={{ uri: request.machineryImages[0] }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        marginRight: 12,
                        backgroundColor: colors.border
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: 12,
                      backgroundColor: colors.border,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                    </View>
                  )}

                  {/* Machinery Details */}
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="construct" size={18} color={colors.primary} />
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.textPrimary, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                        {request.machineryName || 'N/A'}
                      </Text>
                    </View>
                    
                    {/* Category Badge */}
                    {request.machineryCategory && request.machineryCategory !== 'N/A' && request.machineryCategory !== 'Machinery' && (
                      <View style={{ 
                        backgroundColor: colors.primary + '20',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        alignSelf: 'flex-start',
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: colors.primary
                      }}>
                        <Text style={{ 
                          color: colors.primary, 
                          fontSize: 11, 
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}>
                          {request.machineryCategory}
                        </Text>
                      </View>
                    )}

                    {/* Rental Dates - Active vs Completed */}
                    {isActive ? (
                      <>
                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                          <Ionicons name="play-circle" size={14} color="#4caf50" />
                          <Text style={{ color: '#4caf50', marginLeft: 6, fontSize: 13, fontWeight: '600' }}>
                            Started: {request.rentalStartDate || formatDate(request.requestedAt)}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                          <Ionicons name="flag" size={14} color="#ff9800" />
                          <Text style={{ color: '#ff9800', marginLeft: 6, fontSize: 13, fontWeight: '600' }}>
                            Ends on: {endDate}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                          <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                          <Text style={{ color: colors.textSecondary, marginLeft: 6, fontSize: 13 }}>
                            {request.status === 'approved' ? 'Rented:' : 'Requested:'} {request.rentalStartDate || formatDate(request.requestedAt)}
                          </Text>
                        </View>
                        {request.status === 'approved' && (
                          <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginLeft: 6, fontSize: 13 }}>
                              Returned: {endDate}
                            </Text>
                          </View>
                        )}
                      </>
                    )}

                    {/* Duration */}
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <Ionicons name="time" size={14} color={colors.textSecondary} />
                      <Text style={{ color: colors.textSecondary, marginLeft: 6, fontSize: 13 }}>
                        Duration: {request.rentalDuration || `${request.numberOfDays} Day(s)`}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Category & Owner Details */}
                {request.machineryCategory && request.machineryCategory !== 'N/A' && request.machineryCategory !== 'Machinery' && (
                  <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Ionicons name="pricetag" size={16} color={colors.textSecondary} />
                    <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>
                      Category: <Text style={{ fontWeight: '600', color: colors.textPrimary }}>
                        {request.machineryCategory}
                      </Text>
                    </Text>
                  </View>
                )}

                {request.machineryOwnerName && (
                  <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Ionicons name="person" size={16} color={colors.textSecondary} />
                    <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>
                      Owner: {request.machineryOwnerName}
                    </Text>
                  </View>
                )}

                {/* Location */}
                {request.deliveryLocation && (
                  <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'flex-start' }}>
                    <Ionicons name="location" size={16} color={colors.textSecondary} style={{ marginTop: 2 }} />
                    <Text style={{ color: colors.textSecondary, marginLeft: 8, flex: 1 }}>
                      Delivery: {request.deliveryLocation}
                    </Text>
                  </View>
                )}

                {/* Project Type */}
                {request.projectType && (
                  <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Ionicons name="business" size={16} color={colors.textSecondary} />
                    <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>
                      Project: {request.projectType}
                    </Text>
                  </View>
                )}

                {/* Payment Details */}
                <View style={{ 
                  marginTop: 12, 
                  paddingTop: 12, 
                  borderTopWidth: 1, 
                  borderTopColor: colors.border 
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <Text style={{ color: colors.textSecondary }}>Total Rent:</Text>
                    <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                      Rs. {request.totalRent?.toLocaleString() || '0'}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <Text style={{ color: colors.textSecondary }}>Advance Paid:</Text>
                    <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                      Rs. {request.advancePayment?.toLocaleString() || '0'}
                    </Text>
                  </View>

                  {request.remainingPayment > 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <Text style={{ color: colors.textSecondary }}>Remaining:</Text>
                      <Text style={{ color: '#f44336', fontWeight: '700' }}>
                        Rs. {request.remainingPayment?.toLocaleString() || '0'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Request Date */}
                <Text style={{ 
                  marginTop: 12, 
                  fontSize: 12, 
                  color: colors.textSecondary, 
                  fontStyle: 'italic' 
                }}>
                  Requested on: {formatDate(request.requestedAt)}
                </Text>

                {/* Status Badge */}
                {isActive ? (
                  <View style={{ 
                    marginTop: 12,
                    backgroundColor: '#4caf5015',
                    padding: 12,
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: '#4caf50'
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
                      <Text style={{ 
                        color: '#4caf50', 
                        fontWeight: 'bold',
                        fontSize: 15,
                        marginLeft: 8
                      }}>
                        🚜 MACHINERY IS CURRENTLY IN YOUR USE
                      </Text>
                    </View>
                    <Text style={{ color: '#2e7d32', fontSize: 13 }}>
                      • Return this machinery on or before: {endDate}
                    </Text>
                    <Text style={{ color: '#2e7d32', fontSize: 13, marginTop: 3 }}>
                      • Time remaining: {remainingDays} {remainingDays === 1 ? 'day' : 'days'}
                    </Text>
                    <Text style={{ color: '#2e7d32', fontSize: 13, marginTop: 3 }}>
                      • Remaining payment due at return: Rs. {request.remainingPayment?.toLocaleString() || '0'}
                    </Text>
                  </View>
                ) : (
                  <View style={{ 
                    marginTop: 12,
                    backgroundColor: getStatusColor(request.status) + '15',
                    padding: 10,
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: getStatusColor(request.status)
                  }}>
                    <Text style={{ 
                      color: getStatusColor(request.status), 
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {request.status === 'pending' && '⏳ Waiting for admin approval'}
                      {request.status === 'approved' && `✅ Rental completed (${request.rentalStartDate || formatDate(request.requestedAt)} to ${endDate})`}
                      {request.status === 'rejected' && '❌ Request was rejected'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default RentalHistory;
