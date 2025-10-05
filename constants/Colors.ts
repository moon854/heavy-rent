/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#47D6FF';
const tintColorDark = '#47D6FF';

export const Colors = {
  light: {
    // Primary colors
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    primary: '#47D6FF',
    secondary: '#6C757D',
    
    // UI colors
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E1E5E9',
    divider: '#F1F3F4',
    
    // Text colors
    textPrimary: '#11181C',
    textSecondary: '#6C757D',
    textTertiary: '#9AA0A6',
    textInverse: '#FFFFFF',
    
    // Icon colors
    icon: '#687076',
    iconSecondary: '#9AA0A6',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // Status colors
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#CED4DA',
    inputFocus: '#47D6FF',
    placeholder: '#6C757D',
    
    // Button colors
    buttonPrimary: '#47D6FF',
    buttonSecondary: '#6C757D',
    buttonSuccess: '#28A745',
    buttonWarning: '#FFC107',
    buttonError: '#DC3545',
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Primary colors
    text: '#ECEDEE',
    background: '#0D1117',
    tint: tintColorDark,
    primary: '#47D6FF',
    secondary: '#8B949E',
    
    // UI colors
    surface: '#161B22',
    card: '#21262D',
    border: '#30363D',
    divider: '#21262D',
    
    // Text colors
    textPrimary: '#ECEDEE',
    textSecondary: '#8B949E',
    textTertiary: '#6E7681',
    textInverse: '#0D1117',
    
    // Icon colors
    icon: '#9BA1A6',
    iconSecondary: '#6E7681',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Status colors
    success: '#3FB950',
    warning: '#D29922',
    error: '#F85149',
    info: '#58A6FF',
    
    // Input colors
    inputBackground: '#0D1117',
    inputBorder: '#30363D',
    inputFocus: '#47D6FF',
    placeholder: '#8B949E',
    
    // Button colors
    buttonPrimary: '#47D6FF',
    buttonSecondary: '#8B949E',
    buttonSuccess: '#3FB950',
    buttonWarning: '#D29922',
    buttonError: '#F85149',
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
  },
};
