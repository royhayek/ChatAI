// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { getConfiguration } from 'app/src/redux/selectors';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`chat.${key}`, options);

const Intro = ({ setValue, handleSubmit, isAssistant, questions }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const config = useSelector(getConfiguration);
  const language = useSelector(state => state.app.language);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const suggestions = isAssistant ? questions : config?.examples?.[language];
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleExamplePress = useCallback(
    e => {
      setValue(null);
      handleSubmit(e);
      Keyboard.dismiss();
    },
    [setValue, handleSubmit],
  );
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  return (
    <View style={styles.content} onPress={() => Keyboard.dismiss()}>
      <View style={styles.row}>
        {!isAssistant && (
          <>
            <Ionicons name="ios-sunny-outline" size={24} color={theme.dark ? theme.colors.white : theme.colors.black} />
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
