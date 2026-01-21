import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import appNotificationManager from '../services/AppNotificationManager';
import { useSelector } from 'react-redux';

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useSelector((state) => state?.home?.user);

  useEffect(() => {
    // Ensure notifications are initialized when user reaches splash screen
    if (user?.uid) {
      console.log('SplashScreen: User available, ensuring notifications are set up...');
      appNotificationManager.initialize(true).catch(error => {
        console.error('SplashScreen: Error initializing notifications:', error);
      });
    }

    // Show splash screen for 2.5 seconds (typical timing for most apps)
    // This gives enough time for the app to load while not being too long
    const timer = setTimeout(() => {
      // Navigate to the main app after splash screen
      navigation.replace('BottomTab');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, user?.uid]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#47DAFF" />
      
      {/* Logo/Icon */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/Vintage Retro Construction Industry Badge Logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Slogan */}
      <Text style={styles.slogan}>Your Construction Partner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#47DAFF', // Sky blue background
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 300,
    height: 150,
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'System',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'System',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    opacity: 0.9,
  },
});

export default SplashScreen;
