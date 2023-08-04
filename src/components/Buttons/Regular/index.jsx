import { View } from 'react-native';
import { Button as RNPButton, Text, useTheme } from 'react-native-paper';
import React from 'react';
import PT from 'prop-types';
import makeStyles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';

const RegularButton = ({ title, onPress, style, leftIcon, ...props }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]} {...props}>
      <LinearGradient
        start={{ x: 0, y: 0.75 }}
        end={{ x: 1, y: 0.25 }}
        colors={[theme.colors.primary, theme.colors.primary, theme.colors.darkBlue]}
        style={styles.linearBackground}>
        {leftIcon}
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
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
