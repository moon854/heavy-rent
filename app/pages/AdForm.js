import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getAllCategories, addData, updateData } from '../Helper/firebaseHelper';
import { uploadImageToCloudinary } from '../Helper/firebaseHelper';
import { notifyAdminNewAd } from '../Helper/adminNotifications';
import { useSelector } from 'react-redux';
import notificationService from '../services/NotificationService';

const AdForm = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    location: '',
    company: '',
    cnic: '',
    vehicleName: '',
    vehicleCondition: '',
    rentPerDay: '',
    securityDeposit: '',
    specifications: '',
    rentalPolicy1: '',
    rentalPolicy2: '',
    rentalPolicy3: '',
    rentalPolicy4: ''
  });
  const [phoneError, setPhoneError] = useState(false);
  const [cnicError, setCnicError] = useState(false);

  const user = useSelector((state) => state?.home?.user) || {};
  const settings = useSelector((state) => state?.home?.settings) || {};

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    
    // Check if we're in edit mode
    if (route?.params?.editMode && route?.params?.adData) {
      setEditMode(true);
      setEditingAdId(route.params.adData.id);
      populateFormWithAdData(route.params.adData);
    } else {
      prefillUserData();
    }
  }, [route?.params]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const prefillUserData = () => {
    if (user && typeof user === 'object') {
      setFormData(prev => ({
        ...prev,
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || '',
        phone: user.phone || '',
        address: user.address || '',
        location: '', // Let user manually enter location for each ad
        company: user.company || '',
        cnic: user.cnic || '',
      }));
    } else {
      // Set default policies even if no user data
      setFormData(prev => ({
        ...prev,
      }));
    }
  };

  const populateFormWithAdData = (adData) => {
    setFormData({
      fullName: adData.ownerName || '',
      phone: adData.ownerPhone || '',
      address: adData.address || '',
      location: adData.location || '',
      company: adData.ownerCompany || '',
      cnic: adData.ownerCNIC || '',
      vehicleName: adData.name || '',
      vehicleCondition: adData.specifications?.condition || '',
      rentPerDay: adData.price || adData.rentPerDay || '',
      securityDeposit: adData.securityDeposit || '',
      specifications: adData.specifications?.description || adData.specifications?.power || adData.specifications?.capacity || adData.specifications?.torque || '',
    });
    
    // Set category
    setSelectedCategory(adData.categoryName || adData.category || '');
    
    // Set existing images
    if (adData.imageUrls && adData.imageUrls.length > 0) {
      setSelectedImages(adData.imageUrls.map(url => ({ uri: url })));
    } else if (adData.imageUrl) {
      setSelectedImages([{ uri: adData.imageUrl }]);
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

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }));
      
      // Check if digits exceed 11
      const digits = value.replace(/\D/g, '');
      if (digits.length > 11) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    } else if (field === 'cnic') {
      const formatted = formatCNIC(value);
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }));
      
      // Check if digits exceed 13
      const digits = value.replace(/\D/g, '');
      if (digits.length > 13) {
        setCnicError(true);
      } else {
        setCnicError(false);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const pickImage = async () => {
    if (selectedImages.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload up to 10 images only.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        allowsMultipleSelection: true
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.slice(0, 10 - selectedImages.length);
        setSelectedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    console.log('Starting ad submission...');
    console.log('Selected category:', selectedCategory);
    console.log('Vehicle name:', formData.vehicleName);
    console.log('Rent per day:', formData.rentPerDay);
    console.log('Images count:', selectedImages.length);
    
    // Validation
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    
    // Basic Information validation
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter your complete address');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return;
    }
    
    // Vehicle Information validation
    if (!formData.vehicleName.trim()) {
      Alert.alert('Error', 'Please enter vehicle name');
      return;
    }
    if (!formData.rentPerDay.trim()) {
      Alert.alert('Error', 'Please enter rent per day');
      return;
    }
    // Security deposit is optional for old ads, will default to 0 if empty
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    setLoading(true);
    console.log('Validation passed, starting submission...');

    try {
      console.log('Uploading images to Cloudinary...');
      console.log('Selected images count:', selectedImages.length);
      console.log('Selected images data:', selectedImages);
      
      // Upload images to Cloudinary and get URLs
      const imageUrls = [];
      for (const image of selectedImages) {
        try {
          console.log('Uploading image:', image.uri);
          console.log('Image type:', image.type);
          console.log('Image size:', image.fileSize);
          
          const imageUrl = await uploadImageToCloudinary(image.uri);
          console.log('Image uploaded successfully:', imageUrl);
          console.log('Image URL type:', typeof imageUrl);
          console.log('Image URL starts with http:', imageUrl?.startsWith('http'));
          
          imageUrls.push(imageUrl);
        } catch (uploadError) {
          console.error('Upload error for image:', uploadError);
          console.error('Upload error details:', uploadError.message);
          Alert.alert('Error', `Failed to upload image: ${uploadError.message}`);
          setLoading(false);
          return;
        }
      }

      console.log('All images uploaded successfully:', imageUrls);
      console.log('Image URLs validation:', imageUrls.map(url => ({
        url,
        isValid: typeof url === 'string' && url.startsWith('http'),
        length: url?.length
      })));

      // Get selected category data
      const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
      console.log('Selected category data:', selectedCategoryData);
      
      // Prepare machinery data with category linking
      const machineryData = {
        imageUrl: imageUrls[0], // First image as primary
        imageUrls: imageUrls, // All images
        category: selectedCategory, // Category name for display
        categoryId: selectedCategoryData?.id || '', // Category ID for Firebase linking
        categoryName: selectedCategory, // Explicit category name
        name: formData.vehicleName,
        price: formData.rentPerDay,
        priceUnit: 'per day',
        securityDeposit: formData.securityDeposit || '0',
        ownerId: user.uid || user.id,
        userId: user.uid || user.id, // Also save as userId for MyAds page compatibility
        ownerName: formData.fullName || `${user.firstName || ''} ${user.lastName || ''}`,
        ownerPhone: settings.showPhoneNumber !== false ? formData.phone : '',
        ownerCompany: formData.company,
        ownerCNIC: formData.cnic,
        location: formData.location || formData.address,
        address: formData.address,
        specifications: {
          description: formData.specifications || 'Standard',
          condition: formData.vehicleCondition || 'Good'
        },
        rentalPolicies: [
          'Security payment advance must be paid',
          '50% rent advance must be paid, if anyone pays then admin will approve their rental request',
          'Security for each machinery or vehicle may be different',
          'Complete security will be returned to you when the machinery is completely fine'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Prepared machinery data:', machineryData);
      console.log('Machinery data imageUrl:', machineryData.imageUrl);
      console.log('Machinery data imageUrls:', machineryData.imageUrls);
      console.log('Saving to Firebase...');

      // Save to Firebase
      if (editMode) {
        // Update existing ad
        await updateData('machinery', editingAdId, machineryData);
        console.log('Successfully updated ad with ID:', editingAdId);
        
          Alert.alert('Success', 'Ad updated successfully!', [
            { text: 'OK', onPress: () => {
              // Send notification if enabled
              if (settings.adPostedNotification !== false) {
                notificationService.sendLocalNotification(
                  'Ad Updated Successfully! ✏️',
                  `Your "${formData.vehicleName}" ad has been updated`,
                  { type: 'ad_updated', adName: formData.vehicleName }
                );
              }
              navigation.goBack();
            }}
          ]);
      } else {
        // Create new ad
        const docId = await addData('machinery', machineryData);
        console.log('Successfully saved to Firebase with ID:', docId);
        
        // Notify admin about new ad
        await notifyAdminNewAd({ ...machineryData, id: docId }, user.uid || user.id);
        
        Alert.alert('Ad Posted Successfully! 📝', `Your ad "${formData.vehicleName}" has been posted and is now under review by our admin team. You will be notified once it's approved.`, [
          { text: 'OK', onPress: () => {
            // Send notification if enabled
            if (settings.adPostedNotification !== false) {
              notificationService.notifyNewAdPosted(formData.vehicleName, selectedCategory);
            }
            navigation.goBack();
          }}
        ]);
      }

    } catch (error) {
      console.error('Error posting ad:', error);
      Alert.alert('Error', `Failed to post ad: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
          {editMode ? 'Edit Ad' : 'Post New Ad'}
        </Text>
      </View>

      {/* Category Selection */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' }}>
          Select Category *
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.name)}
              style={{
                alignItems: 'center',
                padding: 15,
                marginRight: 10,
                borderRadius: 12,
                backgroundColor: selectedCategory === category.name ? '#47D6FF' : '#f8f9fa',
                borderWidth: 1,
                borderColor: selectedCategory === category.name ? '#47D6FF' : '#ddd',
                minWidth: 120,
              }}
            >
              <Ionicons
                name="build"
                size={24}
                color={selectedCategory === category.name ? '#fff' : '#47D6FF'}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: selectedCategory === category.name ? '#fff' : '#47D6FF',
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Basic Information */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' }}>
          Basic Information *
        </Text>
        <TextInput
          placeholder="Full Name *"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
        />
        <TextInput
          placeholder="Complete Address *"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          multiline={true}
          numberOfLines={3}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa', textAlignVertical: 'top' }}
        />
        <TextInput
          placeholder="City *"
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
        />
        <TextInput
          placeholder="Phone Number (0 3XX XXXXXXX)"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          maxLength={14}
          style={{ 
            borderWidth: 1, 
            borderColor: phoneError ? '#ff0000' : '#ddd', 
            borderRadius: 8, 
            padding: 15, 
            marginBottom: 15, 
            backgroundColor: phoneError ? '#ffe6e6' : '#f8f9fa' 
          }}
        />
        {phoneError && (
          <Text style={{ color: '#ff0000', fontSize: 12, marginTop: -10, marginBottom: 15, marginLeft: 5 }}>
            Phone number should be 11 digits (0 3XX XXXXXXX)
          </Text>
        )}
        <TextInput
          placeholder="Company/Organization"
          value={formData.company}
          onChangeText={(value) => handleInputChange('company', value)}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
       />
       <TextInput
          placeholder="CNIC Number (12345-1234567-1)"
          value={formData.cnic}
          onChangeText={(value) => handleInputChange('cnic', value)}
          keyboardType="numeric"
          maxLength={15}
          style={{ 
            borderWidth: 1, 
            borderColor: cnicError ? '#ff0000' : '#ddd', 
            borderRadius: 8, 
            padding: 15, 
            marginBottom: 15, 
            backgroundColor: cnicError ? '#ffe6e6' : '#f8f9fa' 
          }}
        />
        {cnicError && (
          <Text style={{ color: '#ff0000', fontSize: 12, marginTop: -10, marginBottom: 15, marginLeft: 5 }}>
            CNIC should be 13 digits (XXXXX-XXXXXXX-X)
          </Text>
        )}
      </View>

      {/* Vehicle Information */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' }}>
          Vehicle Information *
        </Text>
        <TextInput
          placeholder="Vehicle Name *"
          value={formData.vehicleName}
          onChangeText={(value) => handleInputChange('vehicleName', value)}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
        />
        <TextInput
          placeholder="Vehicle Condition"
          value={formData.vehicleCondition}
          onChangeText={(value) => handleInputChange('vehicleCondition', value)}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
        />
        <TextInput
          placeholder="Rent per Day (Rs) *"
          value={formData.rentPerDay}
          onChangeText={(value) => handleInputChange('rentPerDay', value)}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
        />
        <TextInput
          placeholder="Security Deposit (Rs) - Optional (Default: 0)"
          value={formData.securityDeposit}
          onChangeText={(value) => handleInputChange('securityDeposit', value)}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa' }}
        />
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' }}>
          Specifications *
        </Text>
        <TextInput
          placeholder="Enter specifications (e.g., Power: 1676, Capacity: 149, Torque: 64738)"
          value={formData.specifications}
          onChangeText={(value) => handleInputChange('specifications', value)}
          multiline={true}
          numberOfLines={3}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#f8f9fa', textAlignVertical: 'top' }}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' }}>
          Rental Policies
        </Text>
        <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15, marginBottom: 15 }}>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8, fontWeight: '600' }}>
            • Security payment advance must be paid
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8, fontWeight: '600' }}>
            • 50% rent advance must be paid, if anyone pays then admin will approve their rental request
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8, fontWeight: '600' }}>
            • Security for each machinery or vehicle may be different
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', fontWeight: '600' }}>
            • Complete security will be returned to you when the machinery is completely fine
          </Text>
        </View>

        {/* Publisher Agreement */}
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 10, color: '#333' }}>
          Publisher Agreement
        </Text>
        <View style={{ backgroundColor: '#e3f2fd', borderRadius: 8, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#2196F3' }}>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 10, fontWeight: '600' }}>
            Important: Commission & Rent Update Policy
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8 }}>
            • When you set a rent price for your machinery, please note that when a rental request is submitted to the admin, the admin will add their commission to the rent amount.
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8 }}>
            • The commission will be added to your set rent (Rent + Commission), and the admin will approve the rental request with this new total rent amount.
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8 }}>
            • The new rent amount (Rent + Commission) will be displayed on your ad and will be the final amount for the rental transaction.
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#333' }}>
            • By posting this ad, you agree to this commission structure and rent update process.
          </Text>
        </View>
      </View>

      {/* Image Upload Section */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' }}>
          Upload Images (Up to 10 images) *
        </Text>
        
        {/* Image Preview Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
          {selectedImages.map((image, index) => (
            <View key={index} style={{ position: 'relative', marginRight: 10, marginBottom: 10 }}>
              <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: '#f0f0f0' }} />
              <TouchableOpacity
                style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ff6b6b', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Image Button */}
        {selectedImages.length < 10 && (
          <TouchableOpacity 
            onPress={pickImage} 
            style={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#f8f9fa', 
              borderWidth: 1, 
              borderColor: '#47D6FF', 
              borderStyle: 'dashed', 
              borderRadius: 8, 
              padding: 20, 
              marginTop: 10 
            }}
          >
            <Ionicons name="camera" size={24} color="#47D6FF" />
            <Text style={{ color: '#47D6FF', fontWeight: '600', marginTop: 5 }}>
              Add Image ({selectedImages.length}/10)
            </Text>
          </TouchableOpacity>
        )}

        {selectedImages.length >= 10 && (
          <Text style={{ color: '#ff6b6b', textAlign: 'center', marginTop: 10 }}>
            Maximum 10 images reached
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#47D6FF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginHorizontal: 20,
          marginBottom: 40,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
          {loading ? (editMode ? 'Updating...' : 'Posting...') : (editMode ? 'Update Ad' : 'Post Ad')}
        </Text>
      </TouchableOpacity>

      {/* Debug Info */}
      {selectedCategory && (
        <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Debug Info:</Text>
          <Text>Selected Category: {selectedCategory}</Text>
          <Text>Category ID: {categories.find(cat => cat.name === selectedCategory)?.id || 'Not found'}</Text>
          <Text>Images Selected: {selectedImages.length}</Text>
          <Text>Vehicle Name: {formData.vehicleName}</Text>
          <Text>Rent: Rs {formData.rentPerDay}/day</Text>
          <Text>Specifications:</Text>
          <Text>  • {formData.specifications || 'Not set'}</Text>
          <Text>Rental Policies:</Text>
          <Text>  • Security payment advance must be paid</Text>
          <Text>  • 50% rent advance must be paid, if anyone pays then admin will approve their rental request</Text>
          <Text>  • Security for each machinery or vehicle may be different</Text>
          <Text>  • Complete security will be returned to you when the machinery is completely fine</Text>
          <Text style={{ fontWeight: 'bold', color: '#333', marginTop: 10 }}>
            📋 Basic Information Display:
          </Text>
          <Text style={{ marginLeft: 10, marginTop: 5 }}>
            👤 Full Name: <Text style={{ fontWeight: '600' }}>{formData.fullName || 'Not set'}</Text>
          </Text>
          <Text style={{ marginLeft: 10 }}>
            📍 Complete Address: <Text style={{ fontWeight: '600' }}>{formData.address || 'Not set'}</Text>
          </Text>
          <Text style={{ marginLeft: 10 }}>
            🏙️ City: <Text style={{ fontWeight: '600' }}>{formData.location || 'Not set'}</Text>
          </Text>
          {settings.showPhoneNumber !== false && (
            <Text style={{ marginLeft: 10 }}>
              📞 Phone: {formData.phone || 'Not set'}
            </Text>
          )}
          <Text style={{ marginLeft: 10 }}>
            🏢 Company: {formData.company || 'Not set'}
          </Text>
          <Text style={{ marginLeft: 10 }}>
            🆔 CNIC: {formData.cnic || 'Not set'}
          </Text>
          <Text style={{ fontWeight: 'bold', color: '#47D6FF', marginTop: 10 }}>
            ✅ Ready to post in "{selectedCategory}" category
          </Text>
        </View>
      )}
      
      {loading && (
        <View style={{ padding: 20, backgroundColor: '#fff2cd', margin: 20, borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', color: '#856404' }}>📤 Posting Ad...</Text>
          <Text style={{ color: '#856404' }}>Please wait while we upload images and save your ad.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AdForm;