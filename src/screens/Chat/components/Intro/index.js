import React, { useCallback } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import _ from 'lodash';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import makeStyles from './styles';
import { t } from 'app/src/config/i18n';
import { appName } from 'app/src/helpers';
import { Examples } from 'app/src/config/constants';

const _t = (key, options) => t(`chat.${key}`, options);

const Intro = ({ setValue, handleSubmit }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleExamplePress = useCallback(
    e => {
      setValue(null);
      handleSubmit(e);
      Keyboard.dismiss();
    },
    [setValue, handleSubmit],
  );

  return (
    <View style={styles.content} onPress={Keyboard.dismiss}>
      <Text variant="headlineLarge" style={styles.title}>
        {appName}
      </Text>
      <View style={styles.content}>
        <View style={styles.row}>
          <Ionicons name="ios-sunny-outline" size={24} color={theme.dark ? 'white' : 'black'} />
          <View style={styles.hSpacer} />
          <Text variant="titleMedium">{_t('examples')}</Text>
        </View>
        <View>
          {_.map(Examples, (e, index) => (
            <TouchableOpacity key={index} style={styles.exampleContainer} onPress={() => handleExamplePress(e)}>
              <Text variant="bodyMedium" style={styles.example}>
                "{e}"
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Intro;
