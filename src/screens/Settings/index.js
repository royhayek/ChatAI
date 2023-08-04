import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Divider, Menu, Modal, Portal, Switch, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setThemeMode } from '../../redux/slices/appSlice';
import i18n, { changeLanguage, isRTL, t } from '../../config/i18n';
import { Fontisto } from '@expo/vector-icons';
import makeStyles from './styles';
import { appName } from 'app/src/helpers';

const _t = (key, options) => t(`settings.${key}`, options);

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const themeMode = useSelector(state => state.app.themeMode);
  const language = useSelector(state => state.app.language);
  const isDark = _.isEqual(themeMode, 'dark');
  const dispatch = useDispatch();

  const [openLangMenu, setOpenLangMenu] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const handleUpgradePress = useCallback(() => navigation.navigate('Subscription'), []);

  const toggleLangMenu = useCallback(() => {
    setOpenLangMenu(cur => !cur);
  }, []);

  const toggleUpgradeModal = useCallback(() => {
    setOpenUpgradeModal(cur => !cur);
  }, []);

  const navigateToInfo = useCallback((type, options) => {
    navigation.navigate('Info', { type, name: _t(type, options) });
  }, []);

  const navigateToSubscription = useCallback(() => {
    navigation.navigate('Subscription');
  }, []);

  const updateLanguage = useCallback(lng => {
    dispatch(setLanguage(lng));
    changeLanguage(lng);
    toggleLangMenu();
  }, []);

  const toggleThemeMode = useCallback(() => dispatch(setThemeMode(isDark ? 'light' : 'dark')), [dispatch, isDark]);

  const renderUpgradeButton = () => (
    <TouchableOpacity onPress={handleUpgradePress} style={styles.upgradeContainer}>
      <View>
        <Text variant="bodyLarge" style={styles.upgradeTitle}>
          {_t('upgrade_to_plus')}
        </Text>
        <Text style={styles.upgradeDesc}> {_t('expanded_access', { name: appName })}</Text>
      </View>
      <Ionicons
        name="ios-chevron-forward-sharp"
        size={28}
        color="white"
        style={{ transform: isRTL ? [{ scaleX: -1 }] : undefined }}
      />
    </TouchableOpacity>
  );

  const languages = [
    {
      locale: 'en',
      title: _t('languages.english'),
    },
    {
      locale: 'fr',
      title: _t('languages.french'),
    },
    {
      locale: 'ar',
      title: _t('languages.arabic'),
    },
  ];

  const sections = () => [
    {
      title: _t('general'),
      items: [
        {
          key: 'language',
          title: _t('language'),
          icon: 'ios-language-outline',
          value: _.find(languages, { locale: language })?.title,
          onPress: () => toggleLangMenu(),
          isMenu: true,
        },
        {
          key: 'theme',
          title: _t('theme'),
          icon: 'ios-sunny-outline',
          value: isDark,
          onPress: toggleThemeMode,
          isSwitch: true,
        },
      ],
    },
    {
      title: _t('subscription'),
      items: [
        {
          key: 'subscription',
          title: _t('manage_subscription'),
          icon: 'ios-today-outline',
          onPress: navigateToSubscription,
        },
      ],
    },
    {
      title: _t('other'),
      items: [
        // {
        //   key: 'faq',
        //   title: _t('faq'),
        //   icon: 'ios-help-circle-outline',
        //   onPress: () => navigateToInfo('faq'),
        // },
        {
          key: 'privacy_policy',
          title: _t('privacy_policy'),
          icon: 'ios-document-text-outline',
          onPress: () => navigateToInfo('privacy_policy'),
        },
        {
          key: 'terms',
          title: _t('terms'),
          icon: 'ios-information-circle-outline',
          onPress: () => navigateToInfo('terms', { name: appName }),
        },
      ],
    },
  ];

  const renderContent = () => (
    <ScrollView
      style={styles.content}
      contentContainerStyle={{ paddingBottom: 30 }}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      {_.map(sections(), ({ title, items }) => (
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
                    contentStyle={{ backgroundColor: theme.colors.background, shadowOpacity: 0.2 }}
                    anchor={
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{value}</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          style={styles.arrowIcon}
                          color={theme.dark ? 'white' : 'black'}
                        />
                      </View>
                    }>
                    {_.map(languages, ({ locale, title }) => (
                      <Menu.Item key={locale} onPress={() => updateLanguage(locale)} title={title} />
                    ))}
                  </Menu>
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    style={styles.arrowIcon}
                    color={theme.dark ? 'white' : 'black'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {renderUpgradeButton()}
      {renderContent()}
    </View>
  );
};

export default SettingsScreen;
