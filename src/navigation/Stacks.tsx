import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthStack/LoginScreen';
import SignupScreen from '../screens/AuthStack/SignupScreen';
import {RootStackParamList} from '../types/navigationTypes';
import HomeScreen from '../screens/AppStack/HomeScreen';
import ChatScreen from '../screens/AppStack/ChatScreen';
import MessageScreen from '../screens/AppStack/MessageScreen';
import NotificationScreen from '../screens/AppStack/NotificationScreen';
import {Linking} from 'react-native';
import {useEffect} from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export const AppStack = () => {

  // Handle deep linking
  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              handleUrl(url);
            }
          });
        }
      })
      .catch(err => {
        console.warn('An error occurred', err);
      });

    Linking.addEventListener('url', event => {
      Linking.canOpenURL(event.url).then(supported => {
        if (supported) {
          handleUrl(event.url);
        }
      });
    });
  }, []);

  const handleUrl = async (url: string) => {
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const type = parts[parts.length - 2];
    if (id) {
      console.log(id);
    }
  };
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
};
