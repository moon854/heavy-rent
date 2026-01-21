import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RentalEstimation = ({ navigation, route }) => {
  const rentalData = route?.params?.rentalData || {};
  const machineryData = route?.params?.machineryData || {};
  
  const [rentPerDay, setRentPerDay] = useState(machineryData?.price || '5000');
  const [numberOfDays, setNumberOfDays] = useState(() => {
    // Initialize with numberOfDays from rentalData if available
    if (rentalData?.numberOfDays) {
      return String(rentalData.numberOfDays);
    }
    return '1';
  });
  const [securityDeposit, setSecurityDeposit] = useState(machineryData?.securityDeposit || '10000');

  // Calculate total rent
  const calculateTotalRent = () => {
    const rent = parseFloat(rentPerDay) || 0;
    const days = parseFloat(numberOfDays) || 0;
    return rent * days;
  }

  // Calculate advance payment (50% Rent + Security Deposit)
  const calculateAdvancePayment = () => {
    const halfRent = calculateTotalRent() * 0.5;
    const security = parseFloat(securityDeposit) || 0;
    return halfRent + security;
  }

  // Calculate remaining payment (50% of rent)
  const calculateRemainingPayment = () => {
    return calculateTotalRent() * 0.5;
  }

  // Calculate grand total (Total Rent + Security Deposit)
  const calculateGrandTotal = () => {
    const totalRent = calculateTotalRent();
    const security = parseFloat(securityDeposit) || 0;
    return totalRent + security;
  }

  // Auto-set number of days from rentalData
  useEffect(() => {
    // Priority 1: Use numberOfDays from rentalData (from date calculation)
    if (rentalData?.numberOfDays !== undefined && rentalData?.numberOfDays !== null) {
      const days = parseInt(rentalData.numberOfDays);
      if (!isNaN(days) && days > 0) {
        setNumberOfDays(String(days));
      }
    }
    // Priority 2: Fallback to rentalDuration (for backward compatibility)
    else if (rentalData?.rentalDuration) {
      const duration = rentalData.rentalDuration;
      if (duration === '1 Day') setNumberOfDays('1');
      else if (duration === '3 Days') setNumberOfDays('3');
      else if (duration === '1 Week') setNumberOfDays('7');
      else if (duration === '2 Weeks') setNumberOfDays('14');
      else if (duration === '1 Month') setNumberOfDays('30');
    }
  }, [rentalData]);

  const goToPayment = () => {
    const paymentData = {
      rentPerDay: parseFloat(rentPerDay),
      numberOfDays: parseFloat(numberOfDays),
      totalRent: calculateTotalRent(),
      securityDeposit: parseFloat(securityDeposit),
      advancePayment: calculateAdvancePayment(),
      remainingPayment: calculateRemainingPayment(),
      grandTotal: calculateGrandTotal(),
      rentalInfo: rentalData
    };
    navigation.navigate("Payment", { 
      paymentData, 
      machineryData 
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>

      {/* Logo */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../../assets/images/home.logo.png')} 
            style={{ width: 60, height: 60, marginRight: 12 }}
            resizeMode="contain"
          />
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', letterSpacing: 1, marginBottom: 2 }}>RENT</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', letterSpacing: 0.5, marginBottom: 2, opacity: 0.9 }}>TO</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', letterSpacing: 1 }}>BUILD</Text>
          </View>
        </View>
      </View>

      {/* Heading */}
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8, color: '#333', textAlign: 'center' }}>
        Rental Estimation
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 25, textAlign: 'center' }}>
        Calculate your rental costs
      </Text>

      {/* Rental Details Card */}
      <View style={{ backgroundColor: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#e0e0e0' }}>
        
        {/* Rent Per Day Display (Read-Only) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
            Machinery Rent Per Day (Pakistani Rupees)
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginRight: 5 }}>Rs.</Text>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '600' }}>
              {rentPerDay} <Text style={{ fontSize: 12, color: '#999' }}>(PKR)</Text>
            </Text>
          </View>
        </View>

        {/* Number of Days Display (Read-Only) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
            Number of Days
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 12 }}>
            <Ionicons name="calendar-outline" size={20} color="#47D6FF" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '600' }}>
              {numberOfDays} {numberOfDays === '1' ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>

        {/* Total Rent Display */}
        <View style={{ backgroundColor: '#47D6FF10', borderRadius: 8, padding: 15, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#47D6FF' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Total Rent</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#47D6FF' }}>
              Rs. {calculateTotalRent().toLocaleString()} <Text style={{ fontSize: 12, color: '#47D6FF', opacity: 0.8 }}>(PKR)</Text>
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
            ({rentPerDay} × {numberOfDays} days)
          </Text>
        </View>

        {/* Security Deposit Display (Read-Only) */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
            Security Deposit (Pakistani Rupees)
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 12 }}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#47D6FF" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '600' }}>
              Rs. {parseFloat(securityDeposit || 0).toLocaleString()} <Text style={{ fontSize: 12, color: '#999' }}>(PKR)</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 25, borderWidth: 2, borderColor: '#47D6FF' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 15, textAlign: 'center' }}>
          Payment Summary
        </Text>

        {/* Total Rent */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Total Rent</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
              Rs. {calculateTotalRent().toLocaleString()} <Text style={{ fontSize: 11, color: '#999' }}>(PKR)</Text>
            </Text>
          </View>

          {/* Security Deposit */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Security Deposit</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
              Rs. {parseFloat(securityDeposit || 0).toLocaleString()} <Text style={{ fontSize: 11, color: '#999' }}>(PKR)</Text>
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#e0e0e0', marginVertical: 15 }} />

          {/* Advance Payment (50% Rent + Security) */}
          <View style={{ marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#ff9800', fontWeight: '600' }}>Advance Payment</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#ff9800' }}>
                Rs. {calculateAdvancePayment().toLocaleString()} <Text style={{ fontSize: 11, color: '#ff9800', opacity: 0.8 }}>(PKR)</Text>
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}>
              (50% Rent: Rs. {(calculateTotalRent() * 0.5).toLocaleString()} + Security: Rs. {parseFloat(securityDeposit || 0).toLocaleString()})
            </Text>
          </View>

          {/* Remaining Payment */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Remaining Payment (50%)</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
              Rs. {calculateRemainingPayment().toLocaleString()} <Text style={{ fontSize: 11, color: '#999' }}>(PKR)</Text>
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#e0e0e0', marginVertical: 15 }} />

          {/* Grand Total */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#47D6FF10', padding: 15, borderRadius: 8, marginTop: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>Grand Total</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#47D6FF' }}>
              Rs. {calculateGrandTotal().toLocaleString()} <Text style={{ fontSize: 14, color: '#47D6FF', opacity: 0.8 }}>(PKR)</Text>
            </Text>
          </View>
      </View>

      {/* Proceed to Payment Button */}
      <TouchableOpacity 
        onPress={goToPayment}
        style={{
          backgroundColor: '#47D6FF',
          borderRadius: 10,
          paddingVertical: 16,
          alignItems: 'center',
          marginBottom: 30,
          flexDirection: 'row',
          justifyContent: 'center',
          shadowColor: '#47D6FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', marginRight: 8 }}>
          Proceed to Payment
        </Text>
        <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  )
}

export default RentalEstimation
