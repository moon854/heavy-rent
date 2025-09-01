import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from './pages/Register';

import Verfication from './pages/Verification'
import Login from './pages/Login'
import Home from './pages/Home'
import Excavators from './pages/Excavators'
import MachineryDetails from './pages/MachineryDetails'
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
    </Stack.Navigator>

  );
}