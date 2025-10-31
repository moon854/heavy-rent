import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSetting, setUser } from '../redux/Slices/HomeDataSlice';
import { updateData } from '../Helper/firebaseHelper';

const PrivacySettings = ({ navigation }) => {
  const homeState = useSelector((state) => state?.home) || {};
  const settings = homeState.settings || {};
  const dispatch = useDispatch();

  const handleToggleSetting = async (settingName) => {
    const currentUserId = homeState?.user?.uid || homeState?.user?.id;
    const currentUser = homeState?.user || {};

    // Determine current and next value from effective source
    const currentValue = (currentUser?.settings?.[settingName] !== undefined)
      ? currentUser.settings[settingName]
      : homeState?.settings?.[settingName];
    const newValue = !currentValue;

    // Update local Redux settings immediately for responsive UI
    dispatch(toggleSetting(settingName));

    // Also mirror into user.settings so UI stays consistent with owner preference
    try {
      const nextUser = {
        ...currentUser,
        settings: { ...(currentUser.settings || {}), [settingName]: newValue }
      };
      dispatch(setUser(nextUser));
    } catch {}

    // Persist to Firestore for owner privacy controls
    try {
      if (currentUserId && settingName === 'showLocation') {
        await updateData('users', currentUserId, { ['settings.showLocation']: newValue });
      }
    } catch (e) {
      // Non-blocking; privacy still works locally even if persistence fails
      console.log('Failed to persist privacy setting:', settingName, e?.message);
    }
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'This will export all your data including ads, profile information, and preferences. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            Alert.alert('Success', 'Your data export will be sent to your email within 24 hours.');
          }
        }
      ]
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your data including ads, profile, and account. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Please type "DELETE" to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete Account', 
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert('Account Deleted', 'Your account and all data have been permanently deleted.');
                    // Here you would implement actual account deletion logic
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange, isDestructive = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, isDestructive && styles.destructiveItem]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: '#47D6FF' }}
          thumbColor={switchValue ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Profile Visibility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Visibility</Text>
        <SettingItem
          icon={<Ionicons name="location-outline" size={24} color="#47D6FF" />}
          title="Show Location"
          subtitle="Display your location on ads"
          showSwitch={true}
          switchValue={(homeState?.user?.settings?.showLocation !== undefined)
            ? homeState.user.settings.showLocation
            : settings.showLocation !== false}
          onSwitchChange={() => handleToggleSetting('showLocation')}
        />
      </View>

      

      

      {/* Data Management - removed as per requirement */}

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <SettingItem
          icon={<Ionicons name="shield-outline" size={24} color="#47D6FF" />}
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          onPress={handlePrivacyPolicy}
        />
        <SettingItem
          icon={<Ionicons name="document-text-outline" size={24} color="#47D6FF" />}
          title="Terms of Service"
          subtitle="Read our terms of service"
          onPress={handleTermsOfService}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  destructiveItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#ff4444',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default PrivacySettings;




