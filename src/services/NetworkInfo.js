// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Text, useTheme } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import RegularButton from '../components/Buttons/Regular';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { t } from '../config/i18n';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`network.${key}`, options);

const NetworkInfo = () => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const [showModal, setShowModal] = useState(false);

  const theme = useTheme();
  const styles = makeStyles(theme);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleRetryPress = useCallback(() => {
    NetInfo.fetch().then(state => state.isConnected && setShowModal(true));
  }, []);
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- EFFECTS ------------------------- //
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  if (showModal) {
    return (
      <Modal visible dismissable={false}>
        <View style={styles.container}>
          <Image source={require('../../assets/no-internet.png')} style={styles.icon} />
          <Text variant="titleSmall" style={styles.text}>
            {_t('no_internet_connection')}
          </Text>
          <RegularButton title={_t('retry_connecting')} onPress={handleRetryPress} />
        </View>
      </Modal>
    );
  }

  return null;
};

export default NetworkInfo;

const makeStyles = theme =>
  StyleSheet.create({
    container: {
      width: '80%',
      padding: 24,
      borderRadius: 18,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    icon: {
      width: 85,
      height: 85,
      marginBottom: 5,
    },
    text: {
      marginBottom: 5,
      fontWeight: 'bold',
      color: theme.dark ? theme.colors.white : theme.colors.black,
    },
  });
