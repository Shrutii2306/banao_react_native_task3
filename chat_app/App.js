import 'react-native-gesture-handler';
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
const Stack = createStackNavigator();
export default function App() {

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Chat' component={ChatScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

