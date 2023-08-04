import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { darkTheme, lightTheme } from './lib/theme';
import RootNavigation from './navigation';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './helpers';
import './config/openAI';
import { createTables } from './data/localdb';
import { changeLanguage, changeLocale } from './config/i18n';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SecureStore from 'expo-secure-store';
import { setMessagesCount, setLastSentDate } from './redux/slices/appSlice';
import { connectAsync } from 'expo-in-app-purchases';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import SubscriptionManager from './services/SubscriptionManager';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Root = () => {
  const dispatch = useDispatch();
  const updateMessagesCount = useCallback(payload => dispatch(setMessagesCount(payload)), [dispatch]);
  const updateLastSentDate = useCallback(payload => dispatch(setLastSentDate(payload)), [dispatch]);

  const themeMode = useSelector(state => state.app.themeMode);
  const language = useSelector(state => state.app.language);
  const isDark = _.isEqual(themeMode, 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Function to initialize the message count from storage
  const initializeMessageCount = async () => {
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
      console.error('Error retrieving message count:', error);
    }
  };

  const initAppPurchases = useCallback(async () => {
    // Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    // if (Platform.OS === 'ios') {
    //   Purchases.configure({ apiKey: 'appl_uYrqzqUSMhQTDEdsFOgvwZLIKHL' });
    // } else if (Platform.OS === 'android') {
    //   Purchases.configure({ apiKey: 'goog_AyUmBLfDDGlCJkjRsrShwZuJtlC' });
    // }

    await connectAsync();
  }, []);

  const handleAnimationFinish = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    initializeMessageCount();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    changeLocale(language);
    createTables();
    initAppPurchases();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <StatusBar style={theme.dark ? 'light' : 'dark'} />
          <RootNavigation />
          {showSplash && (
            <View
              style={{
                flex: 1,
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <StatusBar style="dark" />
              <LottieView
                autoPlay
                loop={false}
                style={{ width: 130, height: 130 }}
                onAnimationFinish={handleAnimationFinish}
                source={require('../assets/splash-lottie.json')}
              />
            </View>
          )}
          {/* <SubscriptionManager /> */}
        </NavigationContainer>
      </BottomSheetModalProvider>
    </PaperProvider>
  );
};

export default Root;
