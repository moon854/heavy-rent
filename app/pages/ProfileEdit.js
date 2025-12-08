import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateData, uploadImageToCloudinary, getDataById } from '../Helper/firebaseHelper';
import { setUser, refreshUser } from '../redux/Slices/HomeDataSlice';

const ProfileEdit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home.user);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [cnicError, setCnicError] = useState(false);

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

  const handleCNICChange = (text) => {
    const formatted = formatCNIC(text);
    setCnic(formatted);
    
    // Check if digits exceed 13
    const digits = text.replace(/\D/g, '');
    if (digits.length > 13) {
      setCnicError(true);
    } else {
      setCnicError(false);
    }
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
    
    // Check if digits exceed 11
    const digits = text.replace(/\D/g, '');
    if (digits.length > 11) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCnic(user.cnic || '');
      setImageUrl(user.imageUrl || '');
    }
  }, [user]);

  const handleImagePicker = async () => {
    try {
      setImageLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Uploading image to Cloudinary:', imageUri);
        const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
        console.log('Image uploaded successfully:', uploadedImageUrl);
        
        if (uploadedImageUrl && uploadedImageUrl.startsWith('http')) {
          setImageUrl(uploadedImageUrl);
          Alert.alert('Success', 'Image uploaded successfully!');
        } else {
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Error', `Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in required fields (Name and Email)');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      setLoading(true);
      
      const updatedUserData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        cnic: cnic.trim(),
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      };

      // Update user data in Firestore
      console.log('Updating user data in Firestore:', updatedUserData);
      await updateData('users', user.uid, updatedUserData);
      console.log('User data updated in Firestore successfully');
      
      // Fetch fresh user data from Firestore to ensure we have the latest
      const freshUserData = await getDataById('users', user.uid);
      console.log('Fetched fresh user data:', freshUserData);
      
      if (freshUserData) {
        // Update Redux store with fresh data from Firestore
        dispatch(setUser(freshUserData));
        console.log('Redux store updated with fresh user data');
      } else {
        // Fallback: Update Redux store with local data
        const updatedUser = { ...user, ...updatedUserData };
        dispatch(setUser(updatedUser));
        console.log('Redux store updated with local data (fallback)');
      }
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Force navigation back immediately - useFocusEffect will handle refresh
            navigation.goBack();
          }
        }
      ]);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Profile Image Section */}
      <View style={styles.imageSection}>
        <TouchableOpacity 
          onPress={handleImagePicker}
          style={styles.imageContainer}
          disabled={imageLoading}
        >
          {imageLoading ? (
            <ActivityIndicator size="large" color="#47D6FF" />
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome6 name="image" size={40} color="#47D6FF" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.imageText}>Tap to change profile picture</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[
              styles.input,
              phoneError && { borderColor: '#ff0000', backgroundColor: '#ffe6e6' }
            ]}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="Enter your phone number (0 3XX XXXXXXX)"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={14}
          />
          {phoneError && (
            <Text style={styles.errorText}>
              Phone number should be 11 digits (0 3XX XXXXXXX)
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CNIC</Text>
          <TextInput
            style={[
              styles.input,
              cnicError && { borderColor: '#ff0000', backgroundColor: '#ffe6e6' }
            ]}
            value={cnic}
            onChangeText={handleCNICChange}
            placeholder="Enter your CNIC (12345-1234567-1)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={15}
          />
          {cnicError && (
            <Text style={styles.errorText}>
              CNIC should be 13 digits (XXXXX-XXXXXXX-X)
            </Text>
          )}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#47D6FF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#47D6FF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#47D6FF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#47D6FF',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ProfileEdit;

