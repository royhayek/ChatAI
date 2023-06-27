import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import makeStyles from './styles';

const CategoriesScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <Text>Categories!</Text>
    </View>
  );
};

export default CategoriesScreen;
