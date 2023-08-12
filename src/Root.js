// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { connectAsync } from 'expo-in-app-purchases';
import * as Notifications from 'expo-notifications';
import { PaperProvider } from 'react-native-paper';
import { withIAPContext } from 'react-native-iap';
import { ref, onValue } from 'firebase/database';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import SplashScreen from './screens/Splash';
import RootNavigation from './navigation';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { setMessagesCount, setLastSentDate, setConfig } from './redux/slices/appSlice';
import SubscriptionManager from './services/SubscriptionManager';
import { registerForPushNotificationsAsync } from './helpers';
import { darkTheme, lightTheme } from './lib/theme';
import NetworkInfo from './services/NetworkInfo';
import { FIREBASE_DB } from 'app/firebaseConfig';
import { createTables } from './data/localdb';
import { changeLocale } from './config/i18n';
import { Firebase } from './config/constants';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Root = () => {
  // --------------------------------------------------------- //
  // ------------------------ REDUX -------------------------- //
  const dispatch = useDispatch();
  const updateMessagesCount = useCallback(payload => dispatch(setMessagesCount(payload)), [dispatch]);
  const updateLastSentDate = useCallback(payload => dispatch(setLastSentDate(payload)), [dispatch]);
  const updateConfiguration = useCallback(payload => dispatch(setConfig(payload)), [dispatch]);

  const themeMode = useSelector(state => state.app.themeMode);
  const language = useSelector(state => state.app.language);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const isDark = _.isEqual(themeMode, 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const getConfiguration = useCallback(async () => {
    try {
      const configRef = ref(FIREBASE_DB, Firebase.CONFIGURATION_REF);
      onValue(configRef, snapshot => {
        const data = snapshot.val();
        updateConfiguration(data);
      });
    } catch (e) {
      console.error('[getConfiguration] - ERROR :: ', e);
    }
  }, [updateConfiguration]);

  // Function to initialize the message count from storage
  const initializeMessageCount = useCallback(async () => {
    try {
      const lastSentDate = await SecureStore.getItemAsync('lastSentDate');
      const today = new Date().toISOString().split('T')[0];

      if (lastSentDate === today) {
        const messageCount = await SecureStore.getItemAsync('messageCount');
        updateMessagesCount(parseInt(messageCount));
        updateLastSentDate(lastSentDate);
      } else {
        await SecureStore.deleteItemAsync('lastSentDate');
        await SecureStore.deleteItemAsync('messageCount');
      }
    } catch (error) {
      console.error('[initializeMessageCount] - ERROR :: ', error);
    }
  }, [updateLastSentDate, updateMessagesCount]);

  const initAppPurchases = useCallback(async () => {
    try {
      await connectAsync();
    } catch (error) {
      console.error('[initAppPurchases] - ERROR :: ', error);
    }
  }, []);
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- EFFECTS ------------------------- //
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(noti => setNotification(noti));
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => console.log(response));

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getConfiguration();
    initializeMessageCount();
    changeLocale(language);
    createTables();
    initAppPurchases();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  return (
    <PaperProvider theme={theme}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <StatusBar style={theme.dark ? 'light' : 'dark'} />
          <RootNavigation />
          <SplashScreen />
          <NetworkInfo />
          <SubscriptionManager />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </PaperProvider>
  );
};

export default withIAPContext(Root);
