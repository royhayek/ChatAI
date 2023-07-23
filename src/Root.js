import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import { Configuration, OpenAIApi } from 'openai';
import { useEffect, useRef, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from './lib/theme';
import RootNavigation from './navigation';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './helpers';
import * as SQLite from 'expo-sqlite';
import './config/openAI';
import { createTables } from './data/localdb';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Root = () => {
  const themeMode = useSelector(state => state.app.themeMode);
  const language = useSelector(state => state.app.language);
  const isDark = _.isEqual(themeMode, 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    createTables();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <RootNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Root;
