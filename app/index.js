import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';


import AdForm from './pages/AdForm';
import ChangePassword from './pages/ChangePassword';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import Excavators from './pages/Excavators';
import MachineryDetails from './pages/MachineryDetails';
import MyAds from './pages/MyAds';
import OwnerProfile from './pages/OwnerProfile';
import NotificationSettings from './pages/NotificationSettings';
import NotificationTest from './pages/NotificationTest';
import Notifications from './pages/Notifications';
import Payment from './pages/Payment';
import ProfileEdit from './pages/ProfileEdit';
import PrivacySettings from './pages/PrivacySettings';
import RentalEstimation from './pages/RentalEstimation';
import RenterForm from './pages/RenterForm';
import Settings from './pages/Settings';
import SplashScreen from './pages/SplashScreen';
import Success from './pages/Success';
import ThemeSettings from './pages/ThemeSettings';
import BottomTab from './Tabs/Bottomtab';

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


import { SafeAreaView } from 'react-native';
import Login from './pages/Login';
import Register from './pages/Register';
import { persistor, store } from './redux/store';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import appNotificationManager from './services/AppNotificationManager';
import { setNotificationNavigateHandler } from './services/NotificationService';
// Removed NavigationContainer wrapper to avoid nested container error

const Stack = createNativeStackNavigator();

function RenderStack() {
  const user = useSelector((state) => state.home.user);

  if (!user?.uid ) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Excavators" component={Excavators} />
      <Stack.Screen name="MachineryDetails" component={MachineryDetails} />
      <Stack.Screen name="OwnerProfile" component={OwnerProfile} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="RenterForm" component={RenterForm} />
      <Stack.Screen name="RentalEstimation" component={RentalEstimation} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="AdForm" component={AdForm} />
        <Stack.Screen name="MyAds" component={MyAds} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        <Stack.Screen name="NotificationTest" component={NotificationTest} />
        <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
    </Stack.Navigator>
  );
}


const App = () => {
  // Initialize notification system when app starts
  React.useEffect(() => {
    appNotificationManager.initialize();
    // Inject navigate handler for notification taps
    setNotificationNavigateHandler((name, params) => {
      // We can navigate by using the root stack via a ref-less approach: use a small task to run after mount
      // By navigating to BottomTab first if needed, then to target screens
      try {
        // You can enhance this with a global nav library; for now, rely on linking via screens stack
        // No-op here; handler will be bound in AppContent where navigation is available
      } catch {}
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const AppContent = () => {
  const { colors } = useTheme();
  const navigation = React.useRef(null);
  // Provide actual navigate handler once mounted via imperative API on navigator
  React.useEffect(() => {
    setNotificationNavigateHandler((name, params) => {
      try {
        // Using React Navigation imperative API via current root navigator
        navigation.current?.navigate?.(name, params);
      } catch (e) {
        console.log('Navigation error from notification:', e?.message);
      }
    });
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Attach ref to a hidden container by wrapping RenderStack in a stub navigator if needed in future. For now, use screen-level navigation from BottomTab root. */}
      <RenderStack ref={navigation} />
    </SafeAreaView>
  );
};

export default App;
