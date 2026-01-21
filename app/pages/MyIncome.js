import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getAllData, getDataById } from '../Helper/firebaseHelper';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const MyIncome = ({ navigation }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalRentals: 0,
    totalDays: 0,
    averagePerRental: 0
  });
  const user = useSelector((state) => state.home.user);

  const fetchIncomeData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching income data for user:', user?.uid);
      
      if (!user?.uid) {
        console.log('No user UID found');
        setLoading(false);
        return;
      }
      
      // Fetch all approved rent requests for this publisher
      // Note: Using single where clause to avoid composite index requirement
      const rentRequestsRef = collection(db, 'rentRequests');
      const q = query(
        rentRequestsRef,
        where('machineryOwnerId', '==', user.uid)
      );
      
      console.log('Executing query for machineryOwnerId:', user.uid);
      const querySnapshot = await getDocs(q);
      console.log('Query returned', querySnapshot.docs.length, 'documents');
      const incomeRecords = [];
      let totalIncome = 0;
      let totalDays = 0;
      
      // Filter approved requests and sort by approvedAt
      const allRequests = [];
      for (const docSnap of querySnapshot.docs) {
        const request = { id: docSnap.id, ...docSnap.data() };
        // Filter for approved status only
        if (request.status === 'approved') {
          allRequests.push(request);
        }
      }
      
      // Sort by approvedAt descending (most recent first)
      allRequests.sort((a, b) => {
        const aDate = a.approvedAt?.toDate ? a.approvedAt.toDate() : new Date(0);
        const bDate = b.approvedAt?.toDate ? b.approvedAt.toDate() : new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
      
      for (const request of allRequests) {
        // Get machinery details to calculate publisher's actual income
        let machinery = null;
        if (request.machineryId) {
          machinery = await getDataById('machinery', request.machineryId);
        }
        
        // Calculate publisher income - ONLY RENT (commission already deducted)
        // NOTE: Security deposit is NOT included in income - it's returned to renter
        // Publisher income = originalPrice * numberOfDays (rent only, no security, no commission)
        let publisherIncome = 0;
        let originalPrice = 0;
        let commission = 0;
        
        if (machinery) {
          // Get the total price (what renter pays) and original price (what publisher set)
          const totalPrice = parseFloat(machinery.price || 0);
          originalPrice = parseFloat(machinery.originalPrice || 0);
          commission = parseFloat(machinery.commission || 0);
          
          // If originalPrice doesn't exist, calculate it from total price
          if (originalPrice === 0 && totalPrice > 0) {
            const defaultCommissionPercent = 0.20; // 20% default
            originalPrice = totalPrice / (1 + defaultCommissionPercent);
            commission = totalPrice - originalPrice;
          } else if (totalPrice > 0 && commission === 0 && originalPrice > 0) {
            // Recalculate commission if not set
            commission = totalPrice - originalPrice;
          }
          
          // Publisher income = ONLY RENT (originalPrice * days)
          // Security deposit is NOT included - it's separate and returned to renter
          publisherIncome = originalPrice * (request.numberOfDays || 1);
        } else {
          // Fallback: use rentPerDay from request if machinery not found
          const rentPerDay = parseFloat(request.rentPerDay || 0);
          // Assume 20% commission, so publisher gets 80% of rent
          originalPrice = rentPerDay * 0.8;
          commission = rentPerDay * 0.2;
          // Only rent, no security deposit
          publisherIncome = originalPrice * (request.numberOfDays || 1);
        }
        
        totalIncome += publisherIncome;
        totalDays += (request.numberOfDays || 1);
        
        // Calculate total rent paid by renter (for display)
        // NOTE: Security deposit is NOT included - it's separate and returned to renter
        const totalRentPaid = (parseFloat(request.rentPerDay || machinery?.price || 0)) * (request.numberOfDays || 1);
        const totalCommission = commission * (request.numberOfDays || 1);
        // Security deposit is NOT part of income - it's a refundable deposit
        
        incomeRecords.push({
          ...request,
          machinery,
          publisherIncome, // Net income after commission
          originalPrice, // Price per day before commission
          commission, // Commission per day
          totalRentPaid, // Total rent paid by renter
          totalCommission, // Total commission for this rental
          approvedDate: request.approvedAt?.toDate ? request.approvedAt.toDate() : new Date()
        });
      }
      
      // Calculate summary
      const totalRentals = incomeRecords.length;
      const averagePerRental = totalRentals > 0 ? totalIncome / totalRentals : 0;
      
      setIncomeData(incomeRecords);
      setSummary({
        totalIncome,
        totalRentals,
        totalDays,
        averagePerRental
      });
      
      console.log('Income data fetched:', {
        totalRecords: incomeRecords.length,
        totalIncome,
        totalRentals
      });
    } catch (error) {
      console.error('Error fetching income data:', error);
      Alert.alert(
        'Error',
        `Failed to load income data: ${error.message || 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('My Income page focused, refreshing income data...');
      fetchIncomeData();
    }, [fetchIncomeData])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchIncomeData();
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#fff' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#47D6FF" />
      }
    >
      {/* Header */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 80, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>My Income</Text>
      </View>

      {loading ? (
        <View style={{ alignItems: 'center', padding: 40 }}>
          <ActivityIndicator size="large" color="#47D6FF" />
          <Text style={{ fontSize: 16, color: '#666', marginTop: 15 }}>Loading income data...</Text>
        </View>
      ) : (
        <>
          {/* Summary Cards */}
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
              Income Summary
            </Text>
            
            {/* Total Income Card */}
            <View style={{
              backgroundColor: '#4CAF50',
              borderRadius: 12,
              padding: 20,
              marginBottom: 15,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}>
              <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9, marginBottom: 5 }}>
                Total Income
              </Text>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff' }}>
                Rs. {summary.totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })} (PKR)
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 10 }}>
              <View style={{
                flex: 1,
                minWidth: '48%',
                backgroundColor: '#E3F2FD',
                borderRadius: 12,
                padding: 15,
                marginBottom: 10
              }}>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Total Rentals</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1976D2' }}>
                  {summary.totalRentals}
                </Text>
              </View>

              <View style={{
                flex: 1,
                minWidth: '48%',
                backgroundColor: '#FFF3E0',
                borderRadius: 12,
                padding: 15,
                marginBottom: 10
              }}>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Total Days</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F57C00' }}>
                  {summary.totalDays}
                </Text>
              </View>

              <View style={{
                flex: 1,
                minWidth: '48%',
                backgroundColor: '#F3E5F5',
                borderRadius: 12,
                padding: 15,
                marginBottom: 10
              }}>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Avg per Rental</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#7B1FA2' }}>
                  Rs. {summary.averagePerRental.toLocaleString('en-US', { maximumFractionDigits: 0 })} (PKR)
                </Text>
              </View>
            </View>
          </View>

          {/* Income Transactions */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
              Income Transactions ({incomeData.length})
            </Text>

            {incomeData.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Ionicons name="wallet-outline" size={60} color="#ccc" />
                <Text style={{ fontSize: 18, color: '#666', marginTop: 15, textAlign: 'center' }}>
                  No income records yet
                </Text>
                <Text style={{ fontSize: 14, color: '#999', marginTop: 5, textAlign: 'center' }}>
                  Your approved rental requests will appear here
                </Text>
              </View>
            ) : (
              incomeData.map((record) => (
                <View
                  key={record.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    marginBottom: 15,
                    padding: 15,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    borderLeftWidth: 4,
                    borderLeftColor: '#4CAF50'
                  }}
                >
                  {/* Machinery Name */}
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                    {record.machineryName || 'Unknown Machinery'}
                  </Text>

                  {/* Rental Details */}
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 3 }}>
                      Renter: {record.userName || 'N/A'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 3 }}>
                      Duration: {record.numberOfDays || 1} day(s) • {record.rentalDuration || 'N/A'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 3 }}>
                      Start Date: {record.rentalStartDate || 'N/A'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      Approved: {formatDate(record.approvedDate)}
                    </Text>
                  </View>

                  {/* Income Breakdown - Only Rent, No Security Deposit */}
                  <View style={{
                    backgroundColor: '#E8F5E9',
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 10
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#2E7D32', marginBottom: 10 }}>
                      Income Breakdown (Rent Only)
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text style={{ fontSize: 12, color: '#666' }}>Total Rent (Renter Paid):</Text>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#333' }}>
                        Rs. {record.totalRentPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })} (PKR)
                      </Text>
                    </View>
                    
                    {record.totalCommission > 0 && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text style={{ fontSize: 12, color: '#d32f2f', fontWeight: '500' }}>
                          Admin Commission (-):
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#d32f2f' }}>
                          - Rs. {record.totalCommission.toLocaleString('en-US', { maximumFractionDigits: 0 })} (PKR)
                        </Text>
                      </View>
                    )}
                    
                    <View style={{
                      height: 1,
                      backgroundColor: '#4CAF50',
                      marginVertical: 8
                    }} />
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#2E7D32', flexShrink: 1, paddingRight: 10 }}>
                        Your Net Income (Rent Only):
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4CAF50', flexShrink: 0 }}>
                        Rs. {record.publisherIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })} (PKR)
                      </Text>
                    </View>
                    
                    <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#C8E6C9' }}>
                      <Text style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginBottom: 3 }}>
                        Rent/Day: Rs. {record.originalPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })} × {record.numberOfDays || 1} days
                      </Text>
                      <Text style={{ fontSize: 10, color: '#999', fontStyle: 'italic' }}>
                        Note: Security deposit is not included (refundable to renter)
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default MyIncome;

