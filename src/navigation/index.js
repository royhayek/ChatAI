import React, { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/Categories';
import SettingsScreen from '../screens/Settings';
import HistoryScreen from '../screens/History';
import ChatScreen from '../screens/Chat';
import { t } from '../config/i18n';
import InfoScreen from '../screens/Info';
import SubscriptionScreen from '../screens/Subscription';
import BackButton from '../components/Buttons/Back';

const _t = key => t(`navigation.${key}`);

const RootNavigation = () => {
  const theme = useTheme();

  const Tab = createBottomTabNavigator();
  const ChatStack = createNativeStackNavigator();
  const CategoriesStack = createNativeStackNavigator();
  const HistoryStack = createNativeStackNavigator();
  const SettingsStack = createNativeStackNavigator();

  const screenOptions = {
    headerTitleStyle: { color: theme.dark ? 'white' : 'black' },
    headerStyle: { backgroundColor: theme.colors.background },
    headerShadowVisible: false,
    headerLeft: props => (props.canGoBack ? <BackButton /> : null),
  };

  const ChatStackScreen = () => {
    return (
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
    );
  };

  const CategoriesStackScreen = () => {
    return (
      <CategoriesStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <CategoriesStack.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ title: _t('categories'), ...screenOptions }}
        />
        <ChatStack.Screen name="Chat" component={ChatScreen} options={{ title: _t('chat'), ...screenOptions }} />
      </CategoriesStack.Navigator>
    );
  };

  const HistoryStackScreen = () => {
    return (
      <HistoryStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <HistoryStack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: _t('history'), ...screenOptions }}
        />
      </HistoryStack.Navigator>
    );
  };

  const SettingsStackScreen = () => {
    return (
      <SettingsStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <SettingsStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: _t('settings'), ...screenOptions }}
        />
        <SettingsStack.Screen
          name="Info"
          component={InfoScreen}
          options={({ route }) => ({ title: route.params?.name, ...screenOptions })}
        />
        <SettingsStack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            title: '',
            ...screenOptions,
          }}
        />
      </SettingsStack.Navigator>
    );
  };

  return (
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
        tabBarIcon: ({ focused, color, size }) => {
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
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
      })}>
      <Tab.Screen name="ChatStack" component={ChatStackScreen} options={{ title: _t('chat') }} />
      <Tab.Screen
        name="HistoryStack"
        component={HistoryStackScreen}
        options={{ title: _t('history'), unmountOnBlur: true }}
      />
      <Tab.Screen name="CategoriesStack" component={CategoriesStackScreen} options={{ title: _t('categories') }} />
      <Tab.Screen name="SettingsStack" component={SettingsStackScreen} options={{ title: _t('settings') }} />
    </Tab.Navigator>
  );
};

export default RootNavigation;
