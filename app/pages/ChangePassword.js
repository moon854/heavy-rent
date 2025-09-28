import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { changePassword, forgotPassword } from '../Helper/firebaseHelper';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.home.user);
  
  // Refs for TextInputs
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-focus the first input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      currentPasswordRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validatePasswords = () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return false;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    try {
      setLoading(true);
      
      await changePassword(currentPassword, newPassword);
      
      Alert.alert(
        'Success', 
        'Password changed successfully!', 
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Clear form and navigate back
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              navigation.goBack();
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Password change error:', error);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in before changing your password';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(user?.email);
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  const PasswordInput = React.memo(({ 
    value, 
    onChangeText, 
    placeholder, 
    showPassword, 
    onToggleVisibility,
    style = {},
    inputRef,
    onSubmitEditing,
    returnKeyType = "next"
  }) => (
    <View style={[styles.passwordContainer, style]}>
      <TextInput
        ref={inputRef}
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        blurOnSubmit={false}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        enablesReturnKeyAutomatically={true}
        textContentType="password"
      />
      <TouchableOpacity 
        style={styles.eyeButton}
        onPress={onToggleVisibility}
      >
        <Ionicons 
          name={showPassword ? "eye-off" : "eye"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
    </View>
  ));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.description}>
          Enter your current password and choose a new password to update your account security.
        </Text>

        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Password *</Text>
          <PasswordInput
            inputRef={currentPasswordRef}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter your current password"
            showPassword={showCurrentPassword}
            onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
          />
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password *</Text>
          <PasswordInput
            inputRef={newPasswordRef}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter your new password"
            showPassword={showNewPassword}
            onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          <Text style={styles.helpText}>
            Password must be at least 6 characters long
          </Text>
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password *</Text>
          <PasswordInput
            inputRef={confirmPasswordRef}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your new password"
            showPassword={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            returnKeyType="done"
            onSubmitEditing={handleChangePassword}
          />
        </View>

        {/* Change Password Button */}
        <TouchableOpacity 
          style={[styles.changeButton, loading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.changeButtonText}>Change Password</Text>
          )}
        </TouchableOpacity>

        {/* Security Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Password Security Tips:</Text>
          <Text style={styles.tipText}>• Use a combination of letters, numbers, and symbols</Text>
          <Text style={styles.tipText}>• Avoid using personal information</Text>
          <Text style={styles.tipText}>• Don't reuse passwords from other accounts</Text>
          <Text style={styles.tipText}>• Consider using a password manager</Text>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#47D6FF',
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  formContainer: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#47D6FF',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  changeButton: {
    backgroundColor: '#47D6FF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#47D6FF',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default ChangePassword;
