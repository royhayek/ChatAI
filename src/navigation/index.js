// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import SubscriptionScreen from '../screens/Subscription';
import AssistantsScreen from '../screens/Assistants';
import BackButton from '../components/Buttons/Back';
import SettingsScreen from '../screens/Settings';
import HistoryScreen from '../screens/History';
import ChatScreen from '../screens/Chat';
import InfoScreen from '../screens/Info';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { t } from '../config/i18n';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = key => t(`navigation.${key}`);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const CategoriesStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const RootNavigation = () => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderHeaderLeft = useCallback(props => (props.canGoBack ? <BackButton /> : null), []);

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      headerTitleStyle: { color: theme.dark ? theme.colors.white : theme.colors.black },
      headerStyle: { backgroundColor: theme.colors.background },
      headerShadowVisible: false,
      headerLeft: renderHeaderLeft,
    }),
    [renderHeaderLeft, theme.colors.background, theme.colors.black, theme.colors.white, theme.dark],
  );

  const ChatStackScreen = useCallback(
    () => (
      <ChatStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <ChatStack.Screen name="Chat" component={ChatScreen} options={{ title: _t('chat'), ...screenOptions }} />
        <ChatStack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            title: '',
            headerTitleAlign: 'center',
            ...screenOptions,
          }}
        />
      </ChatStack.Navigator>
    ),
    [screenOptions],
  );

  const CategoriesStackScreen = useCallback(
    () => (
      <CategoriesStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <CategoriesStack.Screen name="Categories" component={AssistantsScreen} options={{ title: _t('categories'), ...screenOptions }} />
      </CategoriesStack.Navigator>
    ),
    [screenOptions],
  );

  const HistoryStackScreen = useCallback(
    () => (
      <HistoryStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <HistoryStack.Screen name="History" component={HistoryScreen} options={{ title: _t('history'), ...screenOptions }} />
      </HistoryStack.Navigator>
    ),
    [screenOptions],
  );

  const SettingsStackScreen = useCallback(
    () => (
      <SettingsStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ title: _t('settings'), ...screenOptions }} />
        <SettingsStack.Screen name="Info" component={InfoScreen} options={({ route }) => ({ title: route.params?.name, ...screenOptions })} />
        <SettingsStack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            title: '',
            ...screenOptions,
          }}
        />
      </SettingsStack.Navigator>
    ),
    [screenOptions],
  );

  const getTabBarIcon = useCallback(({ focused, color, size }, route) => {
    let iconName;

    if (route.name === 'ChatStack') {
      iconName = focused ? 'md-chatbubble-ellipses' : 'md-chatbubble-ellipses-outline';
    } else if (route.name === 'CategoriesStack') {
      iconName = focused ? 'ios-grid' : 'ios-grid-outline';
    } else if (route.name === 'HistoryStack') {
      iconName = focused ? 'ios-time' : 'ios-time-outline';
    } else if (route.name === 'SettingsStack') {
      iconName = focused ? 'ios-settings' : 'ios-settings-outline';
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
  }, []);

  const Tabs = useCallback(
    () => (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            elevation: 0,
            borderTopWidth: 0,
            backgroundColor: theme.colors.background,
          },
          tabBarHideOnKeyboard: true,
          tabBarAllowFontScaling: true,
          headerShown: false,
          tabBarIcon: props => getTabBarIcon(props, route),
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondary,
        })}>
        <Tab.Screen name="ChatStack" component={ChatStackScreen} options={{ title: _t('chat') }} />
        <Tab.Screen name="HistoryStack" component={HistoryStackScreen} options={{ title: _t('history'), unmountOnBlur: true }} />
        <Tab.Screen name="CategoriesStack" component={CategoriesStackScreen} options={{ title: _t('categories') }} />
        <Tab.Screen name="SettingsStack" component={SettingsStackScreen} options={{ title: _t('settings') }} />
      </Tab.Navigator>
    ),
    [
      getTabBarIcon,
      ChatStackScreen,
      HistoryStackScreen,
      SettingsStackScreen,
      CategoriesStackScreen,
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.background,
    ],
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Tabs} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: _t('chat'), ...screenOptions }} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
