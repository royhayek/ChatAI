// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';
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
import { getConfiguration, getDeviceUuid, getMessagesCount } from 'app/src/redux/selectors';
import { REWARDED_AD_UNIT_ID } from 'app/src/config/constants';
import { increment, ref, update } from 'firebase/database';
import { FIREBASE_DB } from 'app/firebaseConfig';
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
  const messagesCount = useSelector(getMessagesCount);
  const deviceUuid = useSelector(getDeviceUuid);
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

  const availableMsgsCount = useMemo(() => dailyMessagesLimit - messagesCount, [dailyMessagesLimit, messagesCount]);
  const snapPoints = useMemo(() => [availableMsgsCount > 0 ? '55%' : '58%'], [availableMsgsCount]);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleOnPress = useCallback(() => bottomSheetRef.current.expand(), []);

  const handleSheetClose = useCallback(() => {
    _.isFunction(onClose) && onClose();
    bottomSheetRef.current.close();
  }, [onClose]);

  const handleGetUnlimitedPress = useCallback(() => {
    handleSheetClose();
    navigation.navigate('Subscription');
  }, [handleSheetClose, navigation]);

  const handleEarnClick = useCallback(() => {
    rewarded.loaded && rewarded.show();
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
      setLoadedAd(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async reward => {
      const rewardedAmount = __DEV__ ? 1 : Number(reward.amount);
      const updates = {};
      updates[`users/${deviceUuid}/messagesCount`] = increment(-rewardedAmount);
      updates[`users/${deviceUuid}/lastRewardedDate`] = today;
      update(ref(FIREBASE_DB), updates);
      setLoadedAd(false);
      rewarded.load();
    });

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [deviceUuid]);

  useEffect(() => {
    if (!loadedAd) {
      const interval = setInterval(() => {
        rewarded.load();
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [loadedAd]);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderCloseIcon = useCallback(
    () => <Ionicons name="md-close" size={ms(25)} color={theme.dark ? theme.colors.white : theme.colors.black} />,
    [theme.colors.black, theme.colors.white, theme.dark],
  );

  return (
    <>
      <TouchableOpacity onPress={handleOnPress}>
        <Pie radius={ms(16)} activeStrokeWidth={ms(7)} inActiveStrokeWidth={ms(6)} />
      </TouchableOpacity>

      <CustomBottomSheet sheetRef={bottomSheetRef} snapPoints={snapPoints} onClose={handleSheetClose}>
        <View style={styles.bottomSheetHeader}>
          <Text variant="titleMedium" style={styles.bottomSheetTitle}>
            {_t('daily_free_usage')}
          </Text>
          <IconButton size={ms(22)} rippleColor="transparent" style={styles.closeButton} onPress={handleSheetClose} icon={renderCloseIcon} />
        </View>
        <View style={styles.bottomSheetContent}>
          <Pie hasSuffix radius={ms(58)} activeStrokeWidth={ms(15)} inActiveStrokeWidth={ms(14)} />
          <View style={styles.freeMessagesTextBg}>
            <Text variant="labelMedium" style={styles.availableMsgs}>
              {availableMsgsCount > 0 ? _t('free_messages_daily', { name: appName, number: 5 }) : _t('hit_limit')}
            </Text>
          </View>
          <RegularButton title={_t('get_unlimited')} style={styles.upgradeButton} onPress={handleGetUnlimitedPress} />
          <RegularButton
            title={_t('earn')}
            disabled={_.isEqual(availableMsgsCount, dailyMessagesLimit) || !loadedAd}
            style={styles.earnButton}
            onPress={handleEarnClick}
            backgroundColors={['#FF3F3F', '#FF2020', '#FF0000']}
            startIcon={<LottieView autoSize autoPlay style={styles.playLottie} source={require('../../../assets/play-video.json')} />}
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
