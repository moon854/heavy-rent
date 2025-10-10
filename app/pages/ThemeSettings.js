import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSetting } from '../redux/Slices/HomeDataSlice';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSettings = ({ navigation }) => {
  const homeState = useSelector((state) => state?.home) || {};
  const settings = homeState.settings || {
    autoTheme: false,
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    darkMode: false
  };
  const dispatch = useDispatch();
  const { colors, isDark, toggleTheme, setLightMode, setDarkMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(isDark ? 'dark' : 'light');

  const handleToggleSetting = (settingName) => {
    try {
      if (settingName) {
        dispatch(toggleSetting(settingName));
      }
    } catch (error) {
      console.error('Error toggling setting:', error);
    }
  };

  const handleThemeChange = (theme) => {
    try {
      setSelectedTheme(theme);
      if (theme === 'dark') {
        setDarkMode();
      } else {
        setLightMode();
      }
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const handleAutoTheme = () => {
    Alert.alert(
      'Auto Theme',
      'This feature will automatically switch between light and dark themes based on your device settings and time of day.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enable', 
          onPress: () => {
            handleToggleSetting('autoTheme');
            Alert.alert('Success', 'Auto theme enabled! The app will now follow your device theme settings.');
          }
        }
      ]
    );
  };

  const handleThemePreview = (theme) => {
    Alert.alert(
      `Preview ${theme === 'dark' ? 'Dark' : 'Light'} Theme`,
      `This is how the ${theme === 'dark' ? 'dark' : 'light'} theme will look. The interface will have ${theme === 'dark' ? 'dark backgrounds with light text' : 'light backgrounds with dark text'} for better ${theme === 'dark' ? 'night-time' : 'day-time'} viewing.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply Theme', 
          onPress: () => handleThemeChange(theme)
        }
      ]
    );
  };

  const handleResetTheme = () => {
    Alert.alert(
      'Reset Theme Settings',
      'This will reset all theme-related settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            setLightMode();
            setSelectedTheme('light');
            Alert.alert('Success', 'Theme settings have been reset to default.');
          }
        }
      ]
    );
  };

  const ThemeOption = ({ theme, title, description, icon, onPress, isSelected }) => (
    <TouchableOpacity 
      style={[
        styles.themeOption,
        isSelected && styles.selectedThemeOption,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]} 
      onPress={onPress}
    >
      <View style={styles.themeOptionContent}>
        <View style={styles.themeIconContainer}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={isSelected ? colors.primary : colors.icon} 
          />
        </View>
        <View style={styles.themeTextContainer}>
          <Text style={[styles.themeTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={switchValue ? colors.surface : colors.icon}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      )}
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
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
      color: colors.textInverse,
    },
    placeholder: {
      width: 34,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 15,
      marginLeft: 5,
    },
    themeOption: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 12,
      borderWidth: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    selectedThemeOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    themeOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeIconContainer: {
      marginRight: 15,
    },
    themeTextContainer: {
      flex: 1,
    },
    themeTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5,
    },
    themeDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    selectedIndicator: {
      marginLeft: 10,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
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
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 12,
    },
    previewContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 15,
    },
    previewContent: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    previewItem: {
      alignItems: 'center',
    },
    previewText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
    },
    bottomSpacing: {
      height: 30,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textInverse} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Theme Settings</Text>
        <View style={dynamicStyles.placeholder} />
      </View>

      {/* Theme Preview */}
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.previewContainer}>
          <Text style={dynamicStyles.previewTitle}>Current Theme Preview</Text>
          <View style={dynamicStyles.previewContent}>
            <View style={dynamicStyles.previewItem}>
              <View style={[styles.previewBox, { backgroundColor: colors.background }]}>
                <Text style={[styles.previewBoxText, { color: colors.textPrimary }]}>Aa</Text>
              </View>
              <Text style={dynamicStyles.previewText}>Background</Text>
            </View>
            <View style={dynamicStyles.previewItem}>
              <View style={[styles.previewBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.previewBoxText, { color: colors.textPrimary }]}>Aa</Text>
              </View>
              <Text style={dynamicStyles.previewText}>Card</Text>
            </View>
            <View style={dynamicStyles.previewItem}>
              <View style={[styles.previewBox, { backgroundColor: colors.primary }]}>
                <Text style={[styles.previewBoxText, { color: colors.textInverse }]}>Aa</Text>
              </View>
              <Text style={dynamicStyles.previewText}>Primary</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Theme Selection */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Choose Theme</Text>
        <ThemeOption
          theme="light"
          title="Light Theme"
          description="Clean and bright interface perfect for daytime use"
          icon="sunny-outline"
          onPress={() => handleThemePreview('light')}
          isSelected={selectedTheme === 'light'}
        />
        <ThemeOption
          theme="dark"
          title="Dark Theme"
          description="Easy on the eyes for low-light environments"
          icon="moon-outline"
          onPress={() => handleThemePreview('dark')}
          isSelected={selectedTheme === 'dark'}
        />
      </View>

      {/* Theme Options */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Theme Options</Text>
        <SettingItem
          icon={<Ionicons name="contrast-outline" size={24} color={colors.primary} />}
          title="Auto Theme"
          subtitle="Automatically switch based on device settings"
          showSwitch={true}
          switchValue={settings.autoTheme === true}
          onSwitchChange={() => handleAutoTheme()}
        />
        <SettingItem
          icon={<Ionicons name="color-palette-outline" size={24} color={colors.primary} />}
          title="High Contrast"
          subtitle="Enhanced contrast for better readability"
          showSwitch={true}
          switchValue={settings.highContrast === true}
          onSwitchChange={() => handleToggleSetting('highContrast')}
        />
        <SettingItem
          icon={<Ionicons name="eye-outline" size={24} color={colors.primary} />}
          title="Reduce Motion"
          subtitle="Minimize animations and transitions"
          showSwitch={true}
          switchValue={settings.reduceMotion === true}
          onSwitchChange={() => handleToggleSetting('reduceMotion')}
        />
        <SettingItem
          icon={<Ionicons name="text-outline" size={24} color={colors.primary} />}
          title="Large Text"
          subtitle="Increase text size for better readability"
          showSwitch={true}
          switchValue={settings.largeText === true}
          onSwitchChange={() => handleToggleSetting('largeText')}
        />
      </View>

      {/* Advanced Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Advanced</Text>
        <SettingItem
          icon={<Ionicons name="refresh-outline" size={24} color={colors.primary} />}
          title="Reset Theme Settings"
          subtitle="Restore default theme preferences"
          onPress={handleResetTheme}
        />
        <SettingItem
          icon={<Ionicons name="information-circle-outline" size={24} color={colors.primary} />}
          title="About Themes"
          subtitle="Learn more about theme customization"
          onPress={() => Alert.alert(
            'About Themes',
            'HeavyRent supports both light and dark themes to provide the best viewing experience in any lighting condition. You can also customize various accessibility options to make the app more comfortable to use.',
            [{ text: 'OK' }]
          )}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={dynamicStyles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  previewBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E5E9',
  },
  previewBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThemeSettings;




