// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Menu, Switch, Text, useTheme } from 'react-native-paper';
import { getAvailablePurchases } from 'react-native-iap';
import Rate, { AndroidMarket } from 'react-native-rate';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { setLanguage, setOwnedSubscription, setThemeMode } from '../../redux/slices/appSlice';
import { changeLanguage, isRTL, t } from '../../config/i18n';
import { getConfiguration } from 'app/src/redux/selectors';
import { appName } from 'app/src/helpers';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`settings.${key}`, options);

const SettingsScreen = ({ navigation }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const dispatch = useDispatch();
  const updateOwnedSubscription = useCallback(payload => dispatch(setOwnedSubscription(payload)), [dispatch]);

  const config = useSelector(getConfiguration);
  const language = useSelector(state => state.app.language);
  const themeMode = useSelector(state => state.app.themeMode);
  const ownedSubscription = useSelector(state => state.app.ownedSubscription);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [openLangMenu, setOpenLangMenu] = useState(false);

  const isDark = _.isEqual(themeMode, 'dark');
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const toggleLangMenu = useCallback(() => setOpenLangMenu(cur => !cur), []);

  const navigateToInfo = useCallback(
    (type, options) => {
      navigation.navigate('Info', { type, name: _t(type, options) });
    },
    [navigation],
  );

  const navigateToSubscription = useCallback(() => {
    navigation.navigate('Subscription');
  }, [navigation]);

  const updateLanguage = useCallback(
    lng => {
      dispatch(setLanguage(lng));
      changeLanguage(lng);
      toggleLangMenu();
    },
    [dispatch, toggleLangMenu],
  );

  const handleUpgradePress = useCallback(() => navigation.navigate('Subscription'), []);

  const handleRestorePurchase = useCallback(async () => {
    try {
      const purchases = await getAvailablePurchases();
      console.debug('[handleRestorePurchase] :: ', { purchases });
      const lastPurchase = _.last(purchases);
      updateOwnedSubscription(lastPurchase?.productId);
    } catch (error) {
      console.error('[handleRestorePurchase] - ERROR :: ', error);
    }
  }, [updateOwnedSubscription]);

  const handleRateApp = useCallback(() => {
    const options = {
      AppleAppID: config?.other?.appleAppId,
      GooglePackageName: config?.other?.googlePackageName,
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    };
    Rate.rate(options, (success, errorMessage) => {
      if (success) {
        // This technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
        console.debug('User successfully rated the app');
      }
      if (errorMessage) {
        // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
        console.error(`Example page Rate.rate() error: ${errorMessage}`);
      }
    });
  }, [config?.other?.appleAppId, config?.other?.googlePackageName]);

  const toggleThemeMode = useCallback(() => dispatch(setThemeMode(isDark ? 'light' : 'dark')), [dispatch, isDark]);
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ---------------------- RENDER VARS ---------------------- //
  const languages = useMemo(
    () => [
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
    ],
    [],
  );

  const sections = useMemo(
    () => [
      {
        section: _t('general'),
        items: [
          {
            key: 'language',
            name: _t('language'),
            icon: 'ios-language-outline',
            value: _.find(languages, { locale: language })?.title,
            onPress: () => toggleLangMenu(),
            isMenu: true,
          },
          {
            key: 'theme',
            name: _t('theme'),
            icon: 'ios-sunny-outline',
            value: isDark,
            onPress: toggleThemeMode,
            isSwitch: true,
          },
        ],
      },
      {
        section: _t('subscription'),
        items: [
          {
            key: 'restore_purchase',
            name: _t('restore_purchase'),
            icon: 'ios-cart-outline',
            onPress: handleRestorePurchase,
          },
          {
            key: 'manage_subscription',
            name: _t('manage_subscription'),
            icon: 'ios-today-outline',
            onPress: navigateToSubscription,
          },
        ],
      },
      {
        section: _t('other'),
        items: [
          // {
          //   key: 'faq',
          //   name: _t('faq'),
          //   icon: 'ios-help-circle-outline',
          //   onPress: () => navigateToInfo('faq'),
          // },
          {
            key: 'privacy_policy',
            name: _t('privacy_policy'),
            icon: 'ios-document-text-outline',
            onPress: () => navigateToInfo('privacy_policy'),
          },
          {
            key: 'terms',
            name: _t('terms'),
            icon: 'ios-information-circle-outline',
            onPress: () => navigateToInfo('terms', { name: appName }),
          },
          {
            key: 'rate',
            name: _t('rate_app'),
            icon: 'ios-star-outline',
            onPress: () => handleRateApp(),
          },
        ],
      },
    ],
    [handleRateApp, handleRestorePurchase, isDark, language, languages, navigateToInfo, navigateToSubscription, toggleLangMenu, toggleThemeMode],
  );
  // --------------------- /RENDER VARS ---------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderUpgradeButton = useMemo(
    () => (
      <TouchableOpacity onPress={handleUpgradePress} style={styles.upgradeContainer}>
        <View>
          <Text variant="bodyLarge" style={styles.upgradeTitle}>
            {_t('upgrade_to_plus')}
          </Text>
          <Text style={styles.upgradeDesc}> {_t('expanded_access', { name: appName })}</Text>
        </View>
        <Ionicons name="ios-chevron-forward-sharp" size={28} color="white" style={{ transform: isRTL ? [{ scaleX: -1 }] : undefined }} />
      </TouchableOpacity>
    ),
    [handleUpgradePress, styles.upgradeContainer, styles.upgradeDesc, styles.upgradeTitle],
  );

  const renderContent = useMemo(
    () => (
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} overScrollMode="never" showsVerticalScrollIndicator={false}>
        {_.map(sections, ({ section, items }) => (
          <View key={section}>
            <Text variant="titleSmall" style={styles.title}>
              {section}
            </Text>
            <View style={styles.card}>
              {_.map(items, ({ key, icon, name, value, onPress, isSwitch, isMenu }) => (
                <TouchableOpacity key={key} style={styles.item} onPress={onPress}>
                  <View style={styles.iconAndTitle}>
                    <Ionicons name={icon} size={24} style={styles.endIcon} />
                    <Text variant="labelLarge">{name}</Text>
                  </View>
                  {isSwitch ? (
                    <Switch value={value} onValueChange={onPress} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} />
                  ) : isMenu ? (
                    <Menu
                      visible={openLangMenu}
                      onDismiss={toggleLangMenu}
                      anchorPosition="bottom"
                      contentStyle={styles.languageMenuContent}
                      anchor={
                        <View style={styles.anchor}>
                          <Text>{value}</Text>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            style={styles.arrowIcon}
                            color={theme.dark ? theme.colors.white : theme.colors.black}
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
                      color={theme.dark ? theme.colors.white : theme.colors.black}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    ),
    [styles, sections, languages, theme, openLangMenu, updateLanguage, toggleLangMenu],
  );

  return (
    <View style={styles.container}>
      {!ownedSubscription && renderUpgradeButton}
      {renderContent}
    </View>
  );
};

export default SettingsScreen;
