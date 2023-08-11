import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Menu, Switch, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setOwnedSubscription, setThemeMode } from '../../redux/slices/appSlice';
import { changeLanguage, isRTL, t } from '../../config/i18n';
import makeStyles from './styles';
import { appName } from 'app/src/helpers';
import { getAvailablePurchases } from 'react-native-iap';
import Rate, { AndroidMarket } from 'react-native-rate';
import { APPLEAPPID, GOOGLEPACKAGENAME } from 'app/src/config/constants';

const _t = (key, options) => t(`settings.${key}`, options);

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const themeMode = useSelector(state => state.app.themeMode);
  const language = useSelector(state => state.app.language);
  const ownedSubscription = useSelector(state => state.app.ownedSubscription);

  const isDark = _.isEqual(themeMode, 'dark');
  const dispatch = useDispatch();
  const updateOwnedSubscription = useCallback(payload => dispatch(setOwnedSubscription(payload)), [dispatch]);

  const [openLangMenu, setOpenLangMenu] = useState(false);

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
      console.error('[handleRestorePurchase] - error :: ', error);
    }
  }, [updateOwnedSubscription]);

  const handleRateApp = useCallback(() => {
    const options = {
      AppleAppID: APPLEAPPID,
      GooglePackageName: GOOGLEPACKAGENAME,
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
      <Ionicons name="ios-chevron-forward-sharp" size={28} color="white" style={{ transform: isRTL ? [{ scaleX: -1 }] : undefined }} />
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
          key: 'restore_purchase',
          title: _t('restore_purchase'),
          icon: 'ios-cart-outline',
          onPress: handleRestorePurchase,
        },
        {
          key: 'manage_subscription',
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
        {
          key: 'rate',
          title: _t('rate_app'),
          icon: 'ios-star-outline',
          onPress: () => handleRateApp(),
        },
      ],
    },
  ];

  const renderContent = () => (
    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 30 }} overScrollMode="never" showsVerticalScrollIndicator={false}>
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
                  <Switch value={value} onValueChange={onPress} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} />
                ) : isMenu ? (
                  <Menu
                    visible={openLangMenu}
                    onDismiss={toggleLangMenu}
                    anchorPosition="bottom"
                    contentStyle={{ backgroundColor: theme.colors.background, shadowOpacity: 0.2 }}
                    anchor={
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{value}</Text>
                        <Ionicons name="chevron-forward" size={18} style={styles.arrowIcon} color={theme.dark ? 'white' : 'black'} />
                      </View>
                    }>
                    {_.map(languages, ({ locale, title }) => (
                      <Menu.Item key={locale} onPress={() => updateLanguage(locale)} title={title} />
                    ))}
                  </Menu>
                ) : (
                  <Ionicons name="chevron-forward" size={18} style={styles.arrowIcon} color={theme.dark ? 'white' : 'black'} />
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
      {!ownedSubscription && renderUpgradeButton()}
      {renderContent()}
    </View>
  );
};

export default SettingsScreen;
