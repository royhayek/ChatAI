import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { EXAMPLES } from '../../config';
import makeStyles from './styles';

const Intro = ({ setValue, setData }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleExamplePress = useCallback(
    e => {
      setValue(null);
      setData(cur => [...cur, e]);
    },
    [setValue, setData],
  );

  return (
    <View style={styles.content}>
      <Text variant="headlineLarge" style={styles.title}>
        ChatGPT
      </Text>
      <View style={styles.content}>
        <View style={styles.row}>
          <Ionicons name="ios-sunny-outline" size={24} color={theme.dark ? 'white' : 'black'} />
          <View style={styles.hSpacer} />
          <Text variant="titleMedium">Examples</Text>
        </View>
        <View>
          {_.map(EXAMPLES, (e, index) => (
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
