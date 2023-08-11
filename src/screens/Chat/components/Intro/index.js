import React, { useCallback } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import _ from 'lodash';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import makeStyles from './styles';
import { t } from 'app/src/config/i18n';
import { Examples } from 'app/src/config/constants';

const _t = (key, options) => t(`chat.${key}`, options);

const Intro = ({ setValue, handleSubmit, isAssistant, questions }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const suggestions = isAssistant ? questions : Examples;

  const handleExamplePress = useCallback(
    e => {
      setValue(null);
      handleSubmit(e);
      Keyboard.dismiss();
    },
    [setValue, handleSubmit],
  );

  return (
    <View style={styles.content} onPress={() => Keyboard.dismiss()}>
      <View style={styles.row}>
        {!isAssistant && (
          <>
            <Ionicons name="ios-sunny-outline" size={24} color={theme.dark ? 'white' : 'black'} />
            <View style={styles.hSpacer} />
          </>
        )}
        <Text variant="titleMedium" style={styles.hint}>
          {isAssistant ? 'Ask something like' : _t('examples')}
        </Text>
      </View>
      <View>
        {_.map(suggestions, (e, index) => (
          <TouchableOpacity key={index} onPress={() => handleExamplePress(e)}>
            <View style={styles.exampleContainer}>
              <Text variant="bodyMedium" style={styles.example}>
                {e}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Intro;
