import 'react-native-gesture-handler';
import react,{useState,useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { onAuthStateChanged,User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import GroupChatScreen from './screens/GroupChatScreen';
const Stack = createStackNavigator();
export default function App() {

  const [user, setUser] = useState(null);

const InsideLayout = () =>{
  return(
    <Stack.Navigator initialRouteName='Home'>
     
      <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
         <Stack.Screen name='Chat' component={ChatScreen} options={{headerShown: false}}/>
         <Stack.Screen name='GroupChat' component={GroupChatScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}
 useEffect(() => {

    onAuthStateChanged(FIREBASE_AUTH,(user) =>{
      console.log('user',user);
      setUser(user);
    })
  },[])
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ?  (<Stack.Screen name='Login' component={InsideLayout} options={{headerShown:false}}/>):
         (<Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>)       
        }
        
       
      </Stack.Navigator>
    </NavigationContainer>
  )
}

