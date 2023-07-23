import { View } from 'react-native';
import { Button as RNPButton, Text, useTheme } from 'react-native-paper';
import React from 'react';
import PT from 'prop-types';
import makeStyles from './styles';

const RegularButton = ({ title, onPress, ...props }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <RNPButton onPress={onPress} mode="contained" style={styles.container} {...props}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
    </RNPButton>
  );
};

RegularButton.propTypes = {
  title: PT.string.isRequired,
  onPress: PT.func.isRequired,
};

RegularButton.defaultProps = {
  title: 'Submit',
  onPress: () => null,
};

export default RegularButton;
