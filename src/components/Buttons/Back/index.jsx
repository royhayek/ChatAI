import React from 'react';
import PT from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
import makeStyles from './styles';
import LeftChevron from 'app/src/lib/icons/LeftChevron';
import { isRTL } from 'app/src/config/i18n';

const BackButton = ({ title, onPress, ...props }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();

  return (
    <IconButton
      size={20}
      style={styles.container}
      onPress={() => navigation.goBack()}
      icon={props => (
        <LeftChevron
          color={theme.dark ? 'white' : 'black'}
          style={{ transform: [{ rotateY: isRTL ? '180deg' : '0deg' }] }}
        />
      )}
    />
  );
};

BackButton.propTypes = {
  title: PT.string.isRequired,
  onPress: PT.func.isRequired,
};

BackButton.defaultProps = {
  title: 'Submit',
  onPress: () => null,
};

export default BackButton;
