import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from './pages/Register';

import Excavators from './pages/Excavators';
import Home from './pages/Home';
import Login from './pages/Login';
import MachineryDetails from './pages/MachineryDetails';
import Verfication from './pages/Verification';
import RenterForm from './pages/RenterForm';
import RentalEstimation from './pages/RentalEstimation';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Chat from './pages/Chat';
import AdForm from './pages/AdForm';
const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <Stack.Navigator initialRouteName="Register">
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Verification" component={Verfication} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Excavators" component={Excavators} />
      <Stack.Screen name="MachineryDetails" component={MachineryDetails} />
      <Stack.Screen name="RenterForm" component={RenterForm} />
      <Stack.Screen name="RentalEstimation" component={RentalEstimation} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="AdForm" component={AdForm} />
    </Stack.Navigator>

  );
}