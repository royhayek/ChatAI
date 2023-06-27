import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EXAMPLES } from '../Chat/config';
import { Text, useTheme } from 'react-native-paper';
import makeStyles from './styles';
import _ from 'lodash';

const HistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleTextPress = useCallback(e => {
    navigation.navigate('Chat', { value: e });
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
        April
      </Text>
      {_.map(EXAMPLES, (e, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleTextPress(e)}
          style={{ flexDirection: 'row', marginTop: 15 }}>
          <Ionicons name="md-chatbox-outline" size={20} color={theme.dark ? 'white' : 'black'} />
          <Text style={styles.text}>{e}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HistoryScreen;
