import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screen/HomeScreen';
import ConfrimScreen from './src/screen/ConfrimScreen';
import CategoryScreen from './src/screen/CategoryScreen';
import ItemsScreen from './src/screen/ItemsScreen';
import FinishTakeScreen from './src/screen/FinishTakeScreen';
import ReminderScreen from './src/screen/ReminderScreen';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

//modify ui
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notificationPermissions, setNotificationPermissions] = useState(PermissionStatus.UNDETERMINED)

  const handleNotification = (notification) => {
    const { title, body } = notification.request.content;
    const pos = notification.request.content.data.data;
    console.log(title);
    console.log(body);
    console.log(pos);
    Alert.alert(body);
    //removeRpi(pos);
  };

  const handleResponse = (response) => {
    const { title, body } = response.notification.request.content;
    const pos = response.notification.request.content.data.data;
    console.log(title);
    console.log(body);
    console.log(pos);
    Alert.alert(body);
    //removeRpi(pos);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    return status;
  };

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) return;
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, [notificationPermissions]);

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) return;
    const listener = Notifications.addNotificationResponseReceivedListener(handleResponse);
    return () => listener.remove();
  }, [notificationPermissions]);

  return (
    <NavigationContainer>
      <StatusBar barstyle="auto"/>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Confirm"
          component={ConfrimScreen}
          options={{
            headerTitle: "",
            headerTransparent: true
          }}
        />
        <Stack.Screen 
          name="Category"
          component={CategoryScreen}
          options={{
            headerTitle: "Categories",
            headerTransparent: true
          }}
        />
        <Stack.Screen 
          name="Item"
          component={ItemsScreen}
          options={{
            headerTitle: "Items",
            headerTransparent: true
          }}
        />
        <Stack.Screen 
          name="Take"
          component={FinishTakeScreen}
          options={{
            headerTitle: "Take Object",
            headerTransparent: true
          }}
        />
        <Stack.Screen 
          name="Reminder"
          component={ReminderScreen}
          options={{
            headerTitle: "Schedule",
            headerTransparent: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
