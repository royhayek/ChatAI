import { TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Menu, Switch, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import makeStyles from './styles';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setThemeMode } from '../../redux/slices/appSlice';

const SettingsScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const themeMode = useSelector(state => state.app.themeMode);
  const language = useSelector(state => state.app.language);
  const isDark = _.isEqual(themeMode, 'dark');
  const dispatch = useDispatch();

  const [openLangMenu, setOpenLangMenu] = useState(false);

  const handleUpgradePress = useCallback(() => {}, []);

  const toggleLangMenu = useCallback(() => setOpenLangMenu(cur => !cur), [openLangMenu]);

  const toggleThemeMode = useCallback(() => dispatch(setThemeMode(isDark ? 'light' : 'dark')), [dispatch, isDark]);

  const renderUpgradeButton = useMemo(
    () => (
      <TouchableOpacity onPress={handleUpgradePress} style={styles.upgradeContainer}>
        <View>
          <Text variant="bodyLarge" style={styles.upgradeTitle}>
            Upgrade to Plus!
          </Text>
          <Text style={styles.upgradeDesc}>Exapnded access to ChatGPT features</Text>
        </View>
        <Ionicons name="ios-chevron-forward-sharp" size={28} color="white" />
      </TouchableOpacity>
    ),
    [],
  );

  const languages = [
    {
      locale: 'en',
      title: 'English',
    },
    {
      locale: 'fr',
      title: 'French',
    },
    {
      locale: 'ar',
      title: 'Arabic',
    },
  ];

  const sections = [
    {
      title: 'General',
      items: [
        {
          key: 'language',
          title: 'Language',
          icon: 'ios-language-outline',
          value: _.find(languages, { locale: language }).title,
          onPress: toggleLangMenu,
          isMenu: true,
        },
        {
          key: 'theme',
          title: 'Theme',
          icon: 'ios-sunny-outline',
          value: isDark,
          onPress: toggleThemeMode,
          isSwitch: true,
        },
      ],
    },
    {
      title: 'Subscription',
      items: [
        {
          key: 'subscription',
          title: 'Manage Subscription',
          icon: 'ios-today-outline',
          onPress: () => null,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          key: 'faq',
          title: 'Frequently Asked Questions',
          icon: 'ios-help-circle-outline',
          onPress: () => null,
        },
        {
          key: 'privacy_policy',
          title: 'Privacy Policy',
          icon: 'ios-document-text-outline',
          onPress: () => null,
        },
        {
          key: 'about',
          title: 'About ChatGPT',
          icon: 'ios-information-circle-outline',
          onPress: () => null,
        },
      ],
    },
  ];

  const renderContent = useMemo(
    () => (
      <View style={styles.content}>
        {_.map(sections, ({ title, items }) => (
          <View key={title}>
            <Text variant="titleSmall" style={styles.title}>
              {title}
            </Text>
            <View style={styles.card}>
              {_.map(items, ({ key, icon, title, value, onPress, isSwitch, isMenu }) => (
                <TouchableOpacity key={key} style={styles.item} onPress={onPress}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={icon} size={24} style={styles.endIcon} />
                    <Text variant="labelLarge">{title}</Text>
                  </View>
                  {isSwitch ? (
                    <Switch
                      value={value}
                      onValueChange={onPress}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                  ) : isMenu ? (
                    <Menu
                      visible={openLangMenu}
                      onDismiss={toggleLangMenu}
                      anchorPosition="bottom"
                      contentStyle={{ backgroundColor: 'white', shadowOpacity: 0 }}
                      anchor={
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>{value}</Text>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            style={{ marginStart: 3 }}
                            color={theme.dark ? 'white' : 'black'}
                          />
                        </View>
                      }>
                      <Menu.Item
                        onPress={() => {
                          dispatch(setLanguage('en'));
                          toggleLangMenu();
                        }}
                        title="English"
                      />
                      <Menu.Item
                        onPress={() => {
                          dispatch(setLanguage('fr'));
                          toggleLangMenu();
                        }}
                        title="French"
                      />
                      <Menu.Item
                        onPress={() => {
                          dispatch(setLanguage('ar'));
                          toggleLangMenu();
                        }}
                        title="Arabic"
                      />
                    </Menu>
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      style={{ marginStart: 3 }}
                      color={theme.dark ? 'white' : 'black'}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    ),
    [sections],
  );

  return (
    <View style={styles.container}>
      {renderContent}
      {renderUpgradeButton}
    </View>
  );
};

export default SettingsScreen;
