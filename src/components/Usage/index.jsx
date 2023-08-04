// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PT from 'prop-types';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import { IconButton, Portal, Text, useTheme } from 'react-native-paper';
import CustomBottomSheet from 'app/src/components/BottomSheet';
import { useNavigation } from '@react-navigation/native';
import { Platform, TouchableOpacity, View } from 'react-native';
import RegularButton from '../Buttons/Regular';
import Pie from './Pie';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { appName } from 'app/src/helpers';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
import { useSelector } from 'react-redux';
import { DAILY_USAGE_LIMIT } from 'app/src/config/constants';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`usage.${key}`, options);

const Usage = ({ open, onClose }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const messagesCount = useSelector(state => state.app.messagesCount);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  const bottomSheetRef = useRef();
  const navigation = useNavigation();

  const availableMsgsCount = useMemo(() => DAILY_USAGE_LIMIT - messagesCount, [messagesCount]);

  const snapPoints = useMemo(
    () => [
      availableMsgsCount > 0 ? (Platform.OS === 'android' ? '55%' : '45%') : Platform.OS === 'android' ? '58%' : '48%',
    ],
    [],
  );
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
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  useEffect(() => {
    open && bottomSheetRef.current && bottomSheetRef.current.expand();
  }, [open]);

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
            icon={() => <Ionicons name="md-close" size={25} color={theme.dark ? 'white' : 'black'} />}
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
