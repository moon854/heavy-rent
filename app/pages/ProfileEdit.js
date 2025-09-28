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
import { updateData, uploadImageToCloudinary } from '../Helper/firebaseHelper';
import { setUser, refreshUser } from '../redux/Slices/HomeDataSlice';

const ProfileEdit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home.user);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
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

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
        setImageUrl(uploadedImageUrl);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
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
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      };

      // Update user data in Firestore
      await updateData('users', user.uid, updatedUserData);
      
      // Update Redux store
      const updatedUser = { ...user, ...updatedUserData };
      console.log('Updating Redux with:', updatedUser);
      dispatch(setUser(updatedUser));
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Force navigation back and refresh
            navigation.goBack();
            // Small delay to ensure the Profile screen re-renders
            setTimeout(() => {
              // Trigger a re-render by dispatching refreshUser
              dispatch(refreshUser());
            }, 100);
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
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
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
});

export default ProfileEdit;

