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
import uuid from 'react-native-uuid';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import SplashScreen from './screens/Splash';
import RootNavigation from './navigation';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { setMessagesCount, setLastSentDate, setConfig, setDeviceUuid } from './redux/slices/appSlice';
import SubscriptionManager from './services/SubscriptionManager';
import { getLanguage, getThemeMode } from './redux/selectors';
import { registerForPushNotificationsAsync } from './helpers';
import { darkTheme, lightTheme } from './lib/theme';
import NetworkInfo from './services/NetworkInfo';
import { FIREBASE_DB } from 'app/firebaseConfig';
import { Firebase } from './config/constants';
import { createTables } from './data/localdb';
import { changeLocale } from './config/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const updateDeviceUuid = useCallback(payload => dispatch(setDeviceUuid(payload)), [dispatch]);
  const updateConfiguration = useCallback(payload => dispatch(setConfig(payload)), [dispatch]);

  const themeMode = useSelector(getThemeMode);
  const language = useSelector(getLanguage);
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
  // Function to generate and store UUID if not already stored
  const getOrGenerateUUID = async () => {
    try {
      let id = await AsyncStorage.getItem('deviceUUID');
      console.debug('[getOrGenerateUUID] :: ', { id });
      if (!id) {
        // Generate a new UUID
        id = uuid.v4();
        // Store the generated UUID
        await AsyncStorage.setItem('deviceUUID', id);
      }

      updateDeviceUuid(id);
      return id;
    } catch (error) {
      console.error('Error retrieving/generating UUID:', error);
      return null;
    }
  };

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
  const checkDailyMessageCount = async () => {
    const id = await getOrGenerateUUID();
    const today = new Date().toISOString().split('T')[0];
    try {
      const messagesRef = ref(FIREBASE_DB, `users/${id}`);
      onValue(messagesRef, snapshot => {
        const userData = snapshot.val();
        if (userData && userData.lastMessageDate === today) {
          updateMessagesCount(userData.messagesCount || 0);
        }
      });

      updateMessagesCount(0); // Start with 0 if it's a new day
    } catch (error) {
      console.error('Error checking daily message count:', error);
      return 0;
    }
  };

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
    checkDailyMessageCount();
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
