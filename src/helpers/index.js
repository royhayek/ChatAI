import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

export const appName = Constants.expoConfig.name;

export const isAndroid = Platform.OS === 'android';

export const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '2850dfa7-a5c7-4cc0-a06c-be90c8c6d9bc' })).data;
    const fcmToken = (await Notifications.getDevicePushTokenAsync()).data;
    console.info('[expoToken] :: ', token);
    console.info('[fcmToken] :: ', fcmToken);
  } else {
    console.info('Must use physical device for Push Notifications');
  }

  return token;
};

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};
