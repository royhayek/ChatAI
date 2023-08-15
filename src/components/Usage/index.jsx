// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { Platform, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import PT from 'prop-types';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import CustomBottomSheet from 'app/src/components/BottomSheet';
import RegularButton from '../Buttons/Regular';
import Pie from './Pie';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { setLastRewardedDate, setMessagesCount } from 'app/src/redux/slices/appSlice';
import { getConfiguration, getMessagesCount } from 'app/src/redux/selectors';
import { REWARDED_AD_UNIT_ID } from 'app/src/config/constants';
import { appName } from 'app/src/helpers';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`usage.${key}`, options);

const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

const Usage = ({ open, onClose }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const dispatch = useDispatch();
  const updateMessagesCount = useCallback(payload => dispatch(setMessagesCount(payload)), [dispatch]);
  const updateLastRewardedDate = useCallback(payload => dispatch(setLastRewardedDate(payload)), [dispatch]);

  const messagesCount = useSelector(getMessagesCount);
  const config = useSelector(getConfiguration);
  const dailyMessagesLimit = config?.other?.dailyMessagesLimit;
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  const bottomSheetRef = useRef();
  const navigation = useNavigation();

  const [loadedAd, setLoadedAd] = useState(false);

  const availableMsgsCount = useMemo(() => dailyMessagesLimit - messagesCount, [messagesCount]);
  const snapPoints = useMemo(() => {
    return [availableMsgsCount > 0 ? (Platform.OS === 'android' ? '65%' : '55%') : Platform.OS === 'android' ? '18%' : '58%'];
  }, []);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleOnPress = useCallback(() => bottomSheetRef.current.expand(), []);

  const handleSheetClose = useCallback(() => {
    _.isFunction(onClose) && onClose();
    bottomSheetRef.current.close();
  }, []);

  const handleGetUnlimitedPress = useCallback(() => {
    handleSheetClose();
    navigation.navigate('Subscription');
  }, []);

  const handleEarnClick = useCallback(() => {
    rewarded.show();
  }, []);
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- EFFECTS ------------------------- //
  useEffect(() => {
    open && bottomSheetRef.current && bottomSheetRef.current.expand();
  }, [open]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, async () => {
      const lastSentDate = await SecureStore.getItemAsync('lastRewardedDate');
      !_.isEqual(lastSentDate, today) && setLoadedAd(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      await SecureStore.setItemAsync('messageCount', (availableMsgsCount + 1).toString());
      await SecureStore.setItemAsync('lastRewardedDate', today);
      updateMessagesCount(availableMsgsCount + 1);
      updateLastRewardedDate(today);
    });

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  return (
    <>
      <TouchableOpacity onPress={handleOnPress}>
        <Pie radius={16} activeStrokeWidth={7} inActiveStrokeWidth={6} />
      </TouchableOpacity>

      <CustomBottomSheet sheetRef={bottomSheetRef} snapPoints={snapPoints} onClose={handleSheetClose}>
        <View style={styles.bottomSheetHeader}>
          <Text variant="titleMedium" style={styles.bottomSheetTitle}>
            {_t('daily_free_usage')}
          </Text>
          <IconButton
            size={22}
            rippleColor="transparent"
            style={{ position: 'absolute' }}
            onPress={handleSheetClose}
            icon={() => <Ionicons name="md-close" size={25} color={theme.dark ? theme.colors.white : theme.colors.black} />}
          />
        </View>
        <View style={styles.bottomSheetContent}>
          <Pie hasSuffix radius={58} activeStrokeWidth={15} inActiveStrokeWidth={14} />
          <View style={styles.freeMessagesTextBg}>
            <Text variant="labelMedium" style={{ textAlign: 'center' }}>
              {availableMsgsCount > 0 ? _t('free_messages_daily', { name: appName, number: 5 }) : _t('hit_limit')}
            </Text>
          </View>
          <RegularButton title={_t('get_unlimited')} style={styles.upgradeButton} onPress={handleGetUnlimitedPress} />
          <RegularButton
            title={_t('earn')}
            disabled={_.isEqual(availableMsgsCount, dailyMessagesLimit) || !rewarded.loaded || !loadedAd}
            style={styles.earnButton}
            onPress={handleEarnClick}
            backgroundColors={['#FF3F3F', '#FF2020', '#FF0000']}
            startIcon={
              <LottieView
                autoSize
                autoPlay
                style={[
                  {
                    marginRight: 8,
                    height: 25,
                    transform: [{ scale: 1.1 }],
                  },
                ]}
                source={require('../../../assets/play-video.json')}
              />
            }
          />
        </View>
      </CustomBottomSheet>
    </>
  );
};

Usage.propTypes = {
  open: PT.bool,
  onClose: PT.func,
};

Usage.defaultProps = {
  open: false,
  onClose: () => null,
};

export default Usage;
