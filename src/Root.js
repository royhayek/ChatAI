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
import { setMessagesCount, setConfig, setDeviceUuid } from './redux/slices/appSlice';
import SubscriptionManager from './services/SubscriptionManager';
import { getLanguage, getThemeMode } from './redux/selectors';
import { registerForPushNotificationsAsync } from './helpers';
import { darkTheme, lightTheme } from './lib/theme';
import NetworkInfo from './services/NetworkInfo';
import { FIREBASE_ANALYTICS, FIREBASE_DB } from 'app/firebaseConfig';
import { Firebase } from './config/constants';
import { createTables } from './data/localdb';
import { changeLocale } from './config/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logEvent } from 'firebase/analytics';
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
  const [notification, setNotification] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [loadedData, setLoadedData] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const isDark = _.isEqual(themeMode, 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  // Function to generate and store UUID if not already stored
  const getOrGenerateUUID = useCallback(async () => {
    try {
      let id = await AsyncStorage.getItem('deviceUUID');
      console.info('[Firebase User UUID] ::', id);
      if (!id) {
        console.info('[getOrGenerateUUID] :: Generating a new UUID for this new user');
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
  }, [updateDeviceUuid]);

  const getConfiguration = useCallback(() => {
    try {
      return new Promise((resolve, reject) => {
        const configRef = ref(FIREBASE_DB, Firebase.CONFIGURATION_REF);
        onValue(configRef, snapshot => {
          if (snapshot.val()) {
            const data = snapshot.val();
            updateConfiguration(data);
            console.info('[InitData] :: Loaded and stored configuration');
            resolve(data);
          } else {
            reject();
          }
        });
      });
    } catch (e) {
      console.error('[getConfiguration] - ERROR :: ', e);
    }
  }, [updateConfiguration]);

  // Function to initialize the message count from storage
  const checkDailyMessageCount = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
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
        console.info('[InitData] :: Loaded and stored daily messages');
        resolve();
      } catch (error) {
        console.error('Error checking daily message count:', error);
        reject();
        return 0;
      }
    });
  }, [getOrGenerateUUID, updateMessagesCount]);

  const initAppPurchases = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await connectAsync();
        console.info('[InitData] :: Initialized in-app purchases');
        resolve();
      } catch (error) {
        console.error('[initAppPurchases] - ERROR :: ', error);
        reject();
      }
    });
  }, []);

  const initData = useCallback(async () => {
    changeLocale(language);
    await getConfiguration();
    await checkDailyMessageCount();
    await createTables();
    initAppPurchases();
    setLoadedData(true);
  }, [checkDailyMessageCount, getConfiguration, initAppPurchases, language]);
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
    (async () => {
      await initData();
    })();
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
          <SplashScreen loadedData={loadedData} />
          <NetworkInfo />
          <SubscriptionManager />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </PaperProvider>
  );
};

export default withIAPContext(Root);
