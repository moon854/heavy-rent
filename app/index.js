import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from './pages/Register';

import AdForm from './pages/AdForm';
import Chat from './pages/Chat';
import Excavators from './pages/Excavators';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginorRegister from './pages/LoginorRegister';
import MachineryDetails from './pages/MachineryDetails';
import Payment from './pages/Payment';
import RentalEstimation from './pages/RentalEstimation';
import RenterForm from './pages/RenterForm';
import Success from './pages/Success';
import BottomTab from './Tabs/Bottomtab';

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


import { SafeAreaView } from 'react-native';
import { persistor, store } from './redux/store';

const Stack = createNativeStackNavigator();

function RenderStack() {
  const user = useSelector((state) => state.home.user);

  if (!user?.uid ) {
    return (
      <Stack.Navigator initialRouteName="LoginorRegister">
        <Stack.Screen name="Register" component={Register} />
        {/* <Stack.Screen name="Verification" component={Verificatio} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginorRegister" component={LoginorRegister} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="BottomTab">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Excavators" component={Excavators} />
      <Stack.Screen name="MachineryDetails" component={MachineryDetails} />
      <Stack.Screen name="RenterForm" component={RenterForm} />
      <Stack.Screen name="RentalEstimation" component={RentalEstimation} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="AdForm" component={AdForm} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
    </Stack.Navigator>
  );
}


const App = () => {


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RenderStack />
        </Provider>
      </PersistGate>
    </SafeAreaView>
  );
};

export default App;
