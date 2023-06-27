import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoriesScreen from '../screens/Categories';
import SettingsScreen from '../screens/Settings';
import HistoryScreen from '../screens/History';
import ChatScreen from '../screens/Chat';

const RootNavigation = () => {
  const theme = useTheme();

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: { color: theme.dark ? 'white' : 'black' },
        headerStyle: { backgroundColor: theme.colors.background },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = focused ? 'md-chatbubble-ellipses' : 'md-chatbubble-ellipses-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'ios-grid' : 'ios-grid-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'ios-time' : 'ios-time-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-settings' : 'ios-settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
      })}>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigation;
