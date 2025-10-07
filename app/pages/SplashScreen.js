import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();

  useEffect(() => {
    // Show splash screen for 2.5 seconds (typical timing for most apps)
    // This gives enough time for the app to load while not being too long
    const timer = setTimeout(() => {
      // Navigate to the main app after splash screen
      navigation.replace('BottomTab');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#47DAFF" />
      
      {/* Logo/Icon */}
      <View style={styles.logoContainer}>
        {/* Modern Professional Logo */}
        <View style={styles.logo}>
          <View style={styles.logoMain}>
            <View style={styles.logoIcon}>
              <View style={styles.gearOuter} />
              <View style={styles.gearInner} />
              <View style={styles.toolsIcon} />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.rentText}>RENT</Text>
              <Text style={styles.toText}>TO</Text>
              <Text style={styles.buildText}>BUILD</Text>
            </View>
          </View>
        </View>
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
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 140,
    position: 'relative',
  },
  logoMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    position: 'relative',
  },
  gearOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gearInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toolsIcon: {
    width: 25,
    height: 25,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoText: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rentText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'System',
    letterSpacing: 2,
    marginBottom: 2,
  },
  toText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'System',
    letterSpacing: 1,
    marginBottom: 2,
    opacity: 0.9,
  },
  buildText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'System',
    letterSpacing: 2,
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
