import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import makeStyles from './styles';

const InfoScreen = ({ route }) => {
  const type = route.params.type;
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text>{type}</Text>
    </View>
  );
};

export default InfoScreen;
