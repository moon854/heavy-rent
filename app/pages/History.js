import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const RentalHistory = () => {
  const { colors, isDark } = useTheme();
  const user = useSelector((state) => state?.home?.user);
  const [rentalsTaken, setRentalsTaken] = useState([]); // user rented machinery
  const [rentalsGiven, setRentalsGiven] = useState([]); // user rented out machinery
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('taken'); // 'taken' | 'given'

  // Utility function to parse dates from various formats
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    try {
      const str = dateStr.toString().trim();
      let startDate = null;
      
      // Format 1: DD/MM/YYYY or DD-MM-YYYY
      if (str.includes('/') || str.includes('-')) {
        const dateParts = str.split(/[/-]/);
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
          const year = parseInt(dateParts[2]);
          
          // Validate date parts
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
              day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 2020) {
            startDate = new Date(year, month, day);
          }
        }
      }
      
      // Format 2: MM/DD/YYYY (American format)
      if (!startDate && str.includes('/')) {
        const dateParts = str.split('/');
        if (dateParts.length === 3) {
          const month = parseInt(dateParts[0]) - 1;
          const day = parseInt(dateParts[1]);
          const year = parseInt(dateParts[2]);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
              day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 2020) {
            startDate = new Date(year, month, day);
          }
        }
      }
      
      // Format 3: YYYY-MM-DD
      if (!startDate && str.includes('-')) {
        const dateParts = str.split('-');
        if (dateParts.length === 3 && dateParts[0].length === 4) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const day = parseInt(dateParts[2]);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
              day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 2020) {
            startDate = new Date(year, month, day);
          }
        }
      }
      
      // Validate the parsed date
      if (startDate && !isNaN(startDate.getTime())) {
        return startDate;
      }
    } catch (error) {
      console.error('Date parse error:', error);
    }
    
    return null;
  };

  // Utility function to check if rental is very old and should be considered completed
  const isRentalVeryOld = (rental) => {
    if (!rental.requestedAt) return false;
    
    try {
      const requestDate = rental.requestedAt.toDate ? rental.requestedAt.toDate() : new Date(rental.requestedAt);
      const today = new Date();
      const daysDiff = Math.floor((today - requestDate) / (1000 * 60 * 60 * 24));
      
      // If rental was requested more than 30 days ago, consider it completed
      return daysDiff > 30;
    } catch (error) {
      console.error('Error checking rental age:', error);
      return false;
    }
  };


  const fetchRentalHistory = async () => {
    if (!user?.uid && !user?.id) {
      console.log('History: No user ID found');
      setLoading(false);
      return;
    }

    try {
      const userId = user?.uid || user?.id;
      const rentRequestsRef = collection(db, 'rentRequests');
      
      // Fetch both: Taken (as renter) + Given (as owner) without orderBy to avoid index issues
      const takenQuery = query(rentRequestsRef, where('userId', '==', userId));
      const givenQuery = query(rentRequestsRef, where('machineryOwnerId', '==', userId));

      const [takenSnap, givenSnap] = await Promise.all([
        getDocs(takenQuery),
        getDocs(givenQuery)
      ]);

      console.log(`History: Found ${takenSnap.size} taken rental(s) for user`);
      console.log(`History: Found ${givenSnap.size} given rental(s) for user`);

      const takenData = [];
      takenSnap.forEach((doc) => {
        takenData.push({ id: doc.id, ...doc.data() });
      });

      const givenData = [];
      givenSnap.forEach((doc) => {
        givenData.push({ id: doc.id, ...doc.data() });
      });

      const sortByRequestedAtDesc = (arr) =>
        arr.sort((a, b) => {
          const aTime = a.requestedAt?.toDate?.() || new Date(0);
          const bTime = b.requestedAt?.toDate?.() || new Date(0);
          return bTime - aTime;
        });

      setRentalsTaken(sortByRequestedAtDesc(takenData));
      setRentalsGiven(sortByRequestedAtDesc(givenData));
    } catch (error) {
      console.error('History Error:', error.message);
      
      // Try alternative query without orderBy if there's an index error
      if (error.message?.includes('index')) {
        try {
          const userId = user?.uid || user?.id;
          const rentRequestsRef = collection(db, 'rentRequests');
          const takenQuery = query(rentRequestsRef, where('userId', '==', userId));
          const givenQuery = query(rentRequestsRef, where('machineryOwnerId', '==', userId));

          const [takenSnap, givenSnap] = await Promise.all([
            getDocs(takenQuery),
            getDocs(givenQuery)
          ]);

          const takenData = [];
          takenSnap.forEach((doc) => takenData.push({ id: doc.id, ...doc.data() }));

          const givenData = [];
          givenSnap.forEach((doc) => givenData.push({ id: doc.id, ...doc.data() }));

          setRentalsTaken(takenData);
          setRentalsGiven(givenData);
          console.log(`History: Alternative query succeeded - taken=${takenData.length}, given=${givenData.length}`);
        } catch (altError) {
          console.error('History: Alternative query failed:', altError.message);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRentalHistory();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRentalHistory();
  };

  // Function to get status badge
  const getStatusBadge = (rental) => {
    const status = rental.status || 'pending';
    
    // PENDING REQUEST
    if (status === 'pending') {
      return { 
        text: 'Pending Approval', 
        color: '#ff9800', 
        bgColor: '#fff3e0', 
        icon: 'time-outline' 
      };
    }
    
    // REJECTED REQUEST
    if (status === 'rejected') {
      return { 
        text: 'Rejected', 
        color: '#f44336', 
        bgColor: '#ffebee', 
        icon: 'close-circle-outline' 
      };
    }
    
    // APPROVED REQUEST - Check dates
    if (status === 'approved') {
      // Check if we have date information
      if (!rental.rentalStartDate || !rental.numberOfDays) {
        return { 
          text: 'Completed', 
          color: '#9e9e9e', 
          bgColor: '#f5f5f5', 
          icon: 'checkmark-done-outline' 
        };
      }
      
      // Parse dates and check if expired
      const startDate = parseDate(rental.rentalStartDate);
      
      if (startDate) {
        console.log(`Parsing date: ${rental.rentalStartDate} for ${rental.machineryName}`);
        
        // Calculate end date with improved logic
        let daysToAdd = 1; // Default to 1 day
        
        // Try to get days from numberOfDays
        if (rental.numberOfDays) {
          daysToAdd = parseInt(rental.numberOfDays);
        }
        // If not available, try to extract from rentalDuration
        else if (rental.rentalDuration) {
          const durationStr = rental.rentalDuration.toString();
          const dayMatch = durationStr.match(/(\d+)\s*day/i);
          if (dayMatch) {
            daysToAdd = parseInt(dayMatch[1]);
          }
        }
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (daysToAdd - 1));
        
        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get end date (start of day)
        endDate.setHours(0, 0, 0, 0);
        
        // Rental is completed if today's date is AFTER the end date
        // Also consider it completed if today equals the end date (rental ended today)
        const isCompleted = today >= endDate;
        
        console.log(`${rental.machineryName}: Start=${startDate.toDateString()}, End=${endDate.toDateString()}, Today=${today.toDateString()}, Completed=${isCompleted} (${daysToAdd} days rental period)`);
        
        if (isCompleted) {
          return { 
            text: 'Completed', 
            color: '#9e9e9e', 
            bgColor: '#f5f5f5', 
            icon: 'checkmark-done-outline' 
          };
        } else {
          return { 
            text: 'Active - On Rent', 
            color: '#4caf50', 
            bgColor: '#e8f5e9', 
            icon: 'checkmark-circle-outline' 
          };
        }
      } else {
        console.log(`Could not parse date: ${rental.rentalStartDate}`);
      }
      
      // Default to Completed if date parsing fails (since these are in history)
      return { 
        text: 'Completed', 
        color: '#9e9e9e', 
        bgColor: '#f5f5f5', 
        icon: 'checkmark-done-outline' 
      };
    }
    
    // ANY OTHER STATUS = Completed
    return { 
      text: 'Completed', 
      color: '#9e9e9e', 
      bgColor: '#f5f5f5', 
      icon: 'checkmark-done-outline' 
    };
  };

  // Function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore Timestamp
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-GB');
      }
      // Handle regular Date
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('en-GB');
      }
      // Handle string
      return timestamp;
    } catch (error) {
      return 'N/A';
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

  const rentalsToShow = activeTab === 'taken' ? rentalsTaken : rentalsGiven;

  if (rentalsTaken.length === 0 && rentalsGiven.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50
          }}>
            <Ionicons name="file-tray-outline" size={80} color={colors.textSecondary} />
            <Text style={{ 
              fontSize: 18, 
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 20
            }}>
              No rental history available
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 10
            }}>
              Your rental requests will appear here
            </Text>
          </View>
        </ScrollView>
        </View>
    );
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
      {/* Tabs */}
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setActiveTab('taken')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: activeTab === 'taken' ? colors.primary : (isDark ? '#2a2a2a' : '#f2f2f2'),
            alignItems: 'center',
            marginRight: 6,
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <Text style={{ color: activeTab === 'taken' ? colors.textInverse : colors.textPrimary, fontWeight: '700' }}>
            Taken
          </Text>
          <Text style={{ color: activeTab === 'taken' ? colors.textInverse : colors.textSecondary, fontSize: 12 }}>
            {rentalsTaken.length} item(s)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('given')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: activeTab === 'given' ? colors.primary : (isDark ? '#2a2a2a' : '#f2f2f2'),
            alignItems: 'center',
            marginLeft: 6,
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <Text style={{ color: activeTab === 'given' ? colors.textInverse : colors.textPrimary, fontWeight: '700' }}>
            Given
          </Text>
          <Text style={{ color: activeTab === 'given' ? colors.textInverse : colors.textSecondary, fontSize: 12 }}>
            {rentalsGiven.length} item(s)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {rentalsToShow.length === 0 ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            paddingVertical: 40
          }}>
            <Ionicons name="file-tray-outline" size={70} color={colors.textSecondary} />
            <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 15, textAlign: 'center' }}>
              {activeTab === 'taken' ? 'No taken rentals yet' : 'No given rentals yet'}
            </Text>
          </View>
        ) : rentalsToShow.map((rental) => {
          const statusBadge = getStatusBadge(rental);
          
          return (
            <View 
              key={rental.id}
              style={{
          backgroundColor: colors.card,
                borderRadius: 12,
          marginBottom: 20,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border
              }}
            >
              {/* Header with Status Badge */}
          <View style={{
            backgroundColor: colors.primary,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ 
                  color: colors.textInverse, 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  flex: 1
                }}>
                  {rental.machineryName || 'Machinery'}
                </Text>
                <View style={{
                  backgroundColor: statusBadge.bgColor,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Ionicons name={statusBadge.icon} size={16} color={statusBadge.color} />
                  <Text style={{ 
                    color: statusBadge.color, 
                    fontSize: 12, 
                    fontWeight: '600',
                    marginLeft: 4
                  }}>
                    {statusBadge.text}
            </Text>
                </View>
          </View>

              {/* Body */}
              <View style={{ padding: 15 }}>
                {/* Rental Dates */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                  <Text style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 14 }}>
                    <Text style={{ fontWeight: '600', color: colors.textPrimary }}>Start: </Text>
                    {rental.rentalStartDate || 'N/A'}
                  </Text>
                </View>

                {/* Duration */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="time-outline" size={18} color={colors.primary} />
                  <Text style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 14 }}>
                    <Text style={{ fontWeight: '600', color: colors.textPrimary }}>Duration: </Text>
                    {rental.rentalDuration || `${rental.numberOfDays || 1} day(s)`}
                  </Text>
                </View>

                {/* End Date - Always show */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                  <Text style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 14 }}>
                    <Text style={{ fontWeight: '600', color: colors.textPrimary }}>End Date: </Text>
                    {(() => {
                      if (rental.rentalStartDate) {
                        const startDate = parseDate(rental.rentalStartDate);
                        if (startDate) {
                          let daysToAdd = 1; // Default to 1 day
                          
                          // Try to get days from numberOfDays first
                          if (rental.numberOfDays) {
                            daysToAdd = parseInt(rental.numberOfDays);
                          }
                          // If not available, try to extract from rentalDuration
                          else if (rental.rentalDuration) {
                            const durationStr = rental.rentalDuration.toString().toLowerCase();
                            
                            // Try different patterns
                            let dayMatch = durationStr.match(/(\d+)\s*day/i);
                            if (!dayMatch) {
                              dayMatch = durationStr.match(/(\d+)\s*d/i);
                            }
                            if (!dayMatch) {
                              dayMatch = durationStr.match(/(\d+)/);
                            }
                            
                            if (dayMatch) {
                              daysToAdd = parseInt(dayMatch[1]);
                            }
                          }
                          
                          // Calculate end date: if rented for 3 days, end date should be start date + 2 days
                          // Example: 10 Oct + 3 days = 12 Oct (10th, 11th, 12th = 3 days)
                          const endDate = new Date(startDate);
                          endDate.setDate(endDate.getDate() + (daysToAdd - 1));
                          
                          return endDate.toLocaleDateString('en-GB');
                        }
                      }
                      return 'N/A';
                    })()}
                  </Text>
                </View>

                {/* Location */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                  <Ionicons name="location-outline" size={18} color={colors.primary} style={{ marginTop: 2 }} />
                  <Text style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 14, flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: colors.textPrimary }}>Location: </Text>
                    {rental.deliveryLocation || 'N/A'}
                  </Text>
        </View>

                {/* Project Type */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="construct-outline" size={18} color={colors.primary} />
                  <Text style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 14 }}>
                    <Text style={{ fontWeight: '600', color: colors.textPrimary }}>Project: </Text>
                    {rental.projectType || 'N/A'}
            </Text>
          </View>

                {/* Payment Info */}
                <View style={{ 
                  marginTop: 10, 
                  paddingTop: 10, 
                  borderTopWidth: 1, 
                  borderTopColor: colors.border 
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Total Rent:</Text>
                    <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                      Rs. {rental.totalRent?.toLocaleString() || '0'} <Text style={{ fontSize: 11, color: colors.textSecondary }}>(PKR)</Text>
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Security Deposit:</Text>
                    <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                      Rs. {rental.securityDeposit?.toLocaleString() || '0'} <Text style={{ fontSize: 11, color: colors.textSecondary }}>(PKR)</Text>
                    </Text>
                  </View>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    marginTop: 5,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.border
                  }}>
                    <Text style={{ color: colors.textPrimary, fontWeight: 'bold', fontSize: 14 }}>Grand Total:</Text>
                    <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>
                      Rs. {rental.grandTotal?.toLocaleString() || '0'} <Text style={{ fontSize: 13, opacity: 0.8 }}>(PKR)</Text>
            </Text>
          </View>
        </View>

                {/* Request Date */}
                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, fontStyle: 'italic' }}>
                    Requested on: {formatDate(rental.requestedAt)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default RentalHistory;
