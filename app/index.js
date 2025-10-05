import { createNativeStackNavigator } from '@react-navigation/native-stack';


import AdForm from './pages/AdForm';
import ChangePassword from './pages/ChangePassword';
import Excavators from './pages/Excavators';
import MachineryDetails from './pages/MachineryDetails';
import MyAds from './pages/MyAds';
import Payment from './pages/Payment';
import ProfileEdit from './pages/ProfileEdit';
import RentalEstimation from './pages/RentalEstimation';
import RenterForm from './pages/RenterForm';
import Settings from './pages/Settings';
import Success from './pages/Success';
import BottomTab from './Tabs/Bottomtab';

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


import { SafeAreaView } from 'react-native';
import Login from './pages/Login';
import Register from './pages/Register';
import { persistor, store } from './redux/store';
import { ThemeProvider } from '../contexts/ThemeContext';

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
    <Stack.Navigator initialRouteName="BottomTab" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Excavators" component={Excavators} />
      <Stack.Screen name="MachineryDetails" component={MachineryDetails} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="RenterForm" component={RenterForm} />
      <Stack.Screen name="RentalEstimation" component={RentalEstimation} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="AdForm" component={AdForm} />
      <Stack.Screen name="MyAds" component={MyAds} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}


const App = () => {


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <RenderStack />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
};

export default App;
