import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Modal, Text, useTheme } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import RegularButton from '../components/Buttons/Regular';
import { t } from '../config/i18n';

const _t = (key, options) => t(`network.${key}`, options);

const NetworkInfo = () => {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // Alert.alert(`Connection type, ${state.type}`);
      // Alert.alert(`Is connected?', ${state.isConnected}`);
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

  const handleRetryPress = () => {
    NetInfo.fetch().then(state => state.isConnected && setShowModal(true));
  };

  if (showModal) {
    return (
      <Modal visible dismissable={false}>
        <View style={styles.container(theme)}>
          <Image source={require('../../assets/no-internet.png')} style={styles.icon} />
          <Text variant="titleSmall" style={styles.text}>
            f{_t('no_internet_connection')}
          </Text>
          <RegularButton title="Retry Connecting" onPress={handleRetryPress} />
        </View>
      </Modal>
    );
  }

  return null;
};

export default NetworkInfo;

const styles = theme =>
  StyleSheet({
    container: {
      width: '80%',
      padding: 24,
      borderRadius: 18,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dark ? theme.colors.background : theme.colors.backdrop,
    },
    icon: {
      width: 85,
      height: 85,
      marginBottom: 5,
    },
    text: {
      marginBottom: 5,
      fontWeight: 'bold',
    },
  });
