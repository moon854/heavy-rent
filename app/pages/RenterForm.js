import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSelector } from 'react-redux'
import { getAllCategories } from '../Helper/firebaseHelper'

const RenterForm = ({ navigation, route }) => {
  const machineryData = route?.params?.machineryData || {};
  const user = useSelector((state) => state?.home?.user) || {};

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

  // Utility function to calculate number of days from start and end dates
  const calculateDays = (startDateStr, endDateStr) => {
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    }
    return 0;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    cnic: '',
    rentalStartDate: '',
    rentalEndDate: '',
    deliveryLocation: '',
    projectType: 'Construction',
    operatorRequired: 'No',
    emergencyContact: '',
    emergencyName: '',
    acceptedTerms: false,
    category: ''
  })

  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState(new Date())
  const [phoneError, setPhoneError] = useState(false)
  const [emergencyPhoneError, setEmergencyPhoneError] = useState(false)
  const [cnicError, setCnicError] = useState(false)
  const [categories, setCategories] = useState([])
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const projectTypes = ['Construction', 'Road Work', 'Mining', 'Demolition', 'Landscaping', 'Other']

  // Fetch categories and prefills user data on component mount
  useEffect(() => {
    fetchCategories();
    prefillUserData();
    
    // Auto-select category from machineryData if available
    if (machineryData?.categoryName || machineryData?.category) {
      setFormData(prev => ({
        ...prev,
        category: machineryData.categoryName || machineryData.category
      }));
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const prefillUserData = () => {
    if (user && typeof user === 'object') {
      setFormData(prev => ({
        ...prev,
        // Only prefill if field is empty
        fullName: prev.fullName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || ''),
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        cnic: prev.cnic || user.cnic || '',
      }));
    }
  };

  // Function to format phone number in Pakistani domestic format (0 3XX XXXXXXX)
  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    
    // Limit to 11 digits
    const limitedDigits = digits.slice(0, 11);
    
    // Format: 0 3XX XXXXXXX
    if (limitedDigits.length === 0) {
      return '';
    } else if (limitedDigits.length <= 1) {
      return limitedDigits;
    } else if (limitedDigits.length <= 4) {
      return `${limitedDigits.slice(0, 1)} ${limitedDigits.slice(1)}`;
    } else {
      return `${limitedDigits.slice(0, 1)} ${limitedDigits.slice(1, 4)} ${limitedDigits.slice(4)}`;
    }
  };

  const handlePhoneChange = (text, field) => {
    const formatted = formatPhoneNumber(text);
    setFormData({ ...formData, [field]: formatted });
    
    // Check if digits exceed 11
    const digits = text.replace(/\D/g, '');
    if (field === 'phone') {
      if (digits.length > 11) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    } else if (field === 'emergencyContact') {
      if (digits.length > 11) {
        setEmergencyPhoneError(true);
      } else {
        setEmergencyPhoneError(false);
      }
    }
  };

  // Function to format CNIC in Pakistani format (XXXXX-XXXXXXX-X)
  const formatCNIC = (text) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    
    // Limit to 13 digits
    const limitedDigits = digits.slice(0, 13);
    
    // Format: XXXXX-XXXXXXX-X
    if (limitedDigits.length <= 5) {
      return limitedDigits;
    } else if (limitedDigits.length <= 12) {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5)}`;
    } else {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5, 12)}-${limitedDigits.slice(12)}`;
    }
  };

  const handleCNICChange = (text) => {
    const formatted = formatCNIC(text);
    setFormData({ ...formData, cnic: formatted });
    
    // Check if digits exceed 13
    const digits = text.replace(/\D/g, '');
    if (digits.length > 13) {
      setCnicError(true);
    } else {
      setCnicError(false);
    }
  };

  // Date picker change handler for start date
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Format date as DD/MM/YYYY
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormData({ ...formData, rentalStartDate: formattedDate });
    }
  };

  // Date picker change handler for end date
  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedEndDate(selectedDate);
      // Format date as DD/MM/YYYY
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormData({ ...formData, rentalEndDate: formattedDate });
    }
  };

  const goToRentalEst = () => {
    // Validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.cnic) {
      alert('Please fill all required fields')
      return
    }
    if (!formData.deliveryLocation) {
      alert('Please enter delivery location')
      return
    }
    if (!formData.rentalStartDate) {
      alert('Please enter rental start date')
      return
    }
    if (!formData.rentalEndDate) {
      alert('Please enter rental end date')
      return
    }
    // Validate end date is after start date
    const startDate = parseDate(formData.rentalStartDate);
    const endDate = parseDate(formData.rentalEndDate);
    if (startDate && endDate && endDate < startDate) {
      alert('End date must be after start date')
      return
    }
    if (!formData.acceptedTerms) {
      alert('Please accept terms and conditions')
      return
    }
    // Calculate numberOfDays from start and end dates
    const numberOfDays = calculateDays(formData.rentalStartDate, formData.rentalEndDate);
    if (numberOfDays < 1) {
      alert('Please select valid start and end dates')
      return
    }
    // Add numberOfDays to the rental data
    const rentalDataWithDays = {
      ...formData,
      numberOfDays: numberOfDays
    };
    
    navigation.navigate("RentalEstimation", { 
      rentalData: rentalDataWithDays, 
      machineryData: machineryData 
    });
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
      
      {/* Logo */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', marginRight: 15, position: 'relative' }}>
            <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#47D6FF', position: 'absolute', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }} />
            <View style={{ width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, borderColor: '#47D6FF', position: 'absolute', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }} />
            <View style={{ width: 20, height: 20, backgroundColor: '#47D6FF', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }} />
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', letterSpacing: 1, marginBottom: 2 }}>RENT</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', letterSpacing: 0.5, marginBottom: 2, opacity: 0.9 }}>TO</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', letterSpacing: 1 }}>BUILD</Text>
          </View>
        </View>
      </View>

      {/* Heading */}
      <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 10, color: '#333' }}>
        Rental Request Form
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", marginBottom: 25, color: '#666' }}>
        Please fill in the details below
      </Text>

      {/* Section: Category Selection */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📦 Category
        </Text>
        
        <TouchableOpacity 
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: formData.category ? '#333' : '#999' }}>
            {formData.category || 'Select Category'}
          </Text>
          <Ionicons name={showCategoryPicker ? "chevron-up" : "chevron-down"} size={20} color="#47D6FF" />
        </TouchableOpacity>

        {showCategoryPicker && (
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff', maxHeight: 200 }}>
            <ScrollView nestedScrollEnabled={true}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={category.id || index}
                  onPress={() => {
                    setFormData({ ...formData, category: category.name })
                    setShowCategoryPicker(false)
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: index < categories.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}
                >
                  <Text style={{ color: formData.category === category.name ? '#47D6FF' : '#333', fontWeight: formData.category === category.name ? '600' : '400' }}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Section: Personal Information */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📋 Personal Information
        </Text>
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Full Name *" 
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        
        <TextInput 
          style={{ 
            width: "100%", 
            borderWidth: 1, 
            borderColor: phoneError ? "#ff0000" : "#ddd", 
            borderRadius: 8, 
            paddingVertical: 12, 
            paddingHorizontal: 15, 
            marginBottom: 12, 
            backgroundColor: phoneError ? '#ffe6e6' : '#f9f9f9' 
          }} 
          placeholder="Phone / WhatsApp * (0 3XX XXXXXXX)" 
          keyboardType="phone-pad" 
          value={formData.phone}
          onChangeText={(text) => handlePhoneChange(text, 'phone')}
          maxLength={14}
        />
        {phoneError && (
          <Text style={{ color: "#ff0000", fontSize: 12, marginTop: -8, marginBottom: 12, marginLeft: 5 }}>
            Phone number should be 11 digits (0 3XX XXXXXXX)
          </Text>
        )}
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Complete Address *" 
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
        
        <TextInput 
          style={{ 
            width: "100%", 
            borderWidth: 1, 
            borderColor: cnicError ? "#ff0000" : "#ddd", 
            borderRadius: 8, 
            paddingVertical: 12, 
            paddingHorizontal: 15, 
            marginBottom: 12, 
            backgroundColor: cnicError ? '#ffe6e6' : '#f9f9f9' 
          }} 
          placeholder="CNIC Number * (12345-1234567-1)" 
          keyboardType="numeric" 
          value={formData.cnic}
          onChangeText={handleCNICChange}
          maxLength={15}
        />
        {cnicError && (
          <Text style={{ color: "#ff0000", fontSize: 12, marginTop: -8, marginBottom: 12, marginLeft: 5 }}>
            CNIC should be 13 digits (XXXXX-XXXXXXX-X)
          </Text>
        )}
      </View>

      {/* Section: Rental Details */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📅 Rental Details
        </Text>
        
        {/* Start Date */}
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: formData.rentalStartDate ? '#333' : '#999' }}>
            {formData.rentalStartDate || 'Select Rental Start Date *'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#47D6FF" />
        </TouchableOpacity>

        {/* Date Picker for Start Date */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()} // Don't allow past dates
            style={{ backgroundColor: 'white' }}
          />
        )}

        {/* End Date */}
        <TouchableOpacity 
          onPress={() => setShowEndDatePicker(true)}
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: formData.rentalEndDate ? '#333' : '#999' }}>
            {formData.rentalEndDate || 'Select Rental End Date *'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#47D6FF" />
        </TouchableOpacity>

        {/* Date Picker for End Date */}
        {showEndDatePicker && (
          <DateTimePicker
            value={selectedEndDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onEndDateChange}
            minimumDate={formData.rentalStartDate ? parseDate(formData.rentalStartDate) || new Date() : new Date()} // Don't allow past dates or dates before start date
            style={{ backgroundColor: 'white' }}
          />
        )}

        {/* Number of Days Display (Auto-calculated) */}
        {formData.rentalStartDate && formData.rentalEndDate && (
          <View style={{ 
            width: "100%", 
            borderWidth: 1, 
            borderColor: "#47D6FF", 
            borderRadius: 8, 
            paddingVertical: 12, 
            paddingHorizontal: 15, 
            marginBottom: 12, 
            backgroundColor: '#e3f2fd',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#333', fontSize: 14, fontWeight: '600' }}>
              Number of Days:
            </Text>
            <Text style={{ color: '#47D6FF', fontSize: 16, fontWeight: 'bold' }}>
              {calculateDays(formData.rentalStartDate, formData.rentalEndDate)} days
            </Text>
          </View>
        )}

        {/* Rental Period Display */}
        {formData.rentalStartDate && formData.rentalEndDate && (
          <View style={{ 
            backgroundColor: '#e8f5e9', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#4caf50'
          }}>
            <Text style={{ color: '#2e7d32', fontWeight: 'bold', marginBottom: 4 }}>
              📅 Rental Period:
            </Text>
            <Text style={{ color: '#2e7d32', fontSize: 16, fontWeight: '600' }}>
              {(() => {
                const startDate = parseDate(formData.rentalStartDate);
                const endDate = parseDate(formData.rentalEndDate);
                if (startDate && endDate) {
                  const diffTime = Math.abs(endDate - startDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
                  return `${startDate.toLocaleDateString('en-GB')} → ${endDate.toLocaleDateString('en-GB')} (${diffDays} days)`;
                }
                return 'Invalid date format';
              })()}
            </Text>
          </View>
        )}

        {/* Delivery Location */}
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Delivery/Site Location *" 
          value={formData.deliveryLocation}
          onChangeText={(text) => setFormData({ ...formData, deliveryLocation: text })}
        />

        {/* Project Type */}
        <TouchableOpacity 
          onPress={() => setShowProjectPicker(!showProjectPicker)}
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: '#333' }}>Project Type: {formData.projectType}</Text>
          <Ionicons name={showProjectPicker ? "chevron-up" : "chevron-down"} size={20} color="#47D6FF" />
        </TouchableOpacity>

        {showProjectPicker && (
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }}>
            {projectTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setFormData({ ...formData, projectType: type })
                  setShowProjectPicker(false)
                }}
                style={{ paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: index < projectTypes.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}
              >
                <Text style={{ color: formData.projectType === type ? '#47D6FF' : '#333' }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Operator Required */}
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Operator Required?</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity 
              onPress={() => setFormData({ ...formData, operatorRequired: 'Yes' })}
              style={{ 
                flex: 1, 
                borderWidth: 1, 
                borderColor: formData.operatorRequired === 'Yes' ? '#47D6FF' : '#ddd', 
                borderRadius: 8, 
                paddingVertical: 12, 
                alignItems: 'center',
                backgroundColor: formData.operatorRequired === 'Yes' ? '#47D6FF10' : '#f9f9f9'
              }}
            >
              <Text style={{ color: formData.operatorRequired === 'Yes' ? '#47D6FF' : '#333', fontWeight: formData.operatorRequired === 'Yes' ? '600' : '400' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFormData({ ...formData, operatorRequired: 'No' })}
              style={{ 
                flex: 1, 
                borderWidth: 1, 
                borderColor: formData.operatorRequired === 'No' ? '#47D6FF' : '#ddd', 
                borderRadius: 8, 
                paddingVertical: 12, 
                alignItems: 'center',
                backgroundColor: formData.operatorRequired === 'No' ? '#47D6FF10' : '#f9f9f9'
              }}
            >
              <Text style={{ color: formData.operatorRequired === 'No' ? '#47D6FF' : '#333', fontWeight: formData.operatorRequired === 'No' ? '600' : '400' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Section: Emergency Contact */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          🆘 Emergency Contact
        </Text>
        
        <TextInput 
          style={{ width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9f9f9' }} 
          placeholder="Emergency Contact Name" 
          value={formData.emergencyName}
          onChangeText={(text) => setFormData({ ...formData, emergencyName: text })}
        />
        
        <TextInput 
          style={{ 
            width: "100%", 
            borderWidth: 1, 
            borderColor: emergencyPhoneError ? "#ff0000" : "#ddd", 
            borderRadius: 8, 
            paddingVertical: 12, 
            paddingHorizontal: 15, 
            marginBottom: 12, 
            backgroundColor: emergencyPhoneError ? '#ffe6e6' : '#f9f9f9' 
          }} 
          placeholder="Emergency Contact Number (0 3XX XXXXXXX)" 
          keyboardType="phone-pad"
          value={formData.emergencyContact}
          onChangeText={(text) => handlePhoneChange(text, 'emergencyContact')}
          maxLength={14}
        />
        {emergencyPhoneError && (
          <Text style={{ color: "#ff0000", fontSize: 12, marginTop: -8, marginBottom: 12, marginLeft: 5 }}>
            Phone number should be 11 digits (0 3XX XXXXXXX)
          </Text>
        )}
      </View>

      {/* Terms & Conditions */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#47D6FF', marginBottom: 15 }}>
          📋 Terms & Conditions
        </Text>
        
        <View style={{ 
          backgroundColor: '#f9f9f9', 
          borderWidth: 1, 
          borderColor: '#ddd', 
          borderRadius: 8, 
          padding: 15, 
          marginBottom: 15 
        }}>
          <Text style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '600' }}>
            Payment Requirements:
          </Text>
          <Text style={{ fontSize: 13, color: '#666', lineHeight: 20 }}>
            • Machinery Security Deposit{'\n'}
            • 50% Rent Advance Payment{'\n'}
            • Balance payment upon delivery
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => setFormData({ ...formData, acceptedTerms: !formData.acceptedTerms })}
          style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}
        >
          <View style={{ 
            width: 24, 
            height: 24, 
            borderWidth: 2, 
            borderColor: formData.acceptedTerms ? '#47D6FF' : '#ccc', 
            borderRadius: 4, 
            marginRight: 10,
            backgroundColor: formData.acceptedTerms ? '#47D6FF' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 2
          }}>
            {formData.acceptedTerms && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
          <Text style={{ flex: 1, fontSize: 13, color: '#666', lineHeight: 20 }}>
            I accept the rental terms and conditions including security deposit and 50% advance payment requirement *
          </Text>
        </TouchableOpacity>
      </View>

      {/* Button */}
      <TouchableOpacity 
        onPress={goToRentalEst} 
        style={{ 
          width: "100%", 
          backgroundColor: "#47D6FF", 
          paddingVertical: 15, 
          borderRadius: 8, 
          alignItems: "center", 
          marginBottom: 30,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", marginRight: 8 }}>Proceed to Checkout</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

    </ScrollView>
  )
}

export default RenterForm
