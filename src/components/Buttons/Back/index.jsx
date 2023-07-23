import React from 'react';
import PT from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
import Icon from '../../Icon';
import makeStyles from './styles';

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
        <Icon name="leftChevron" {...props} size={15} iconStyle={{ color: theme.dark ? 'white' : 'black' }} />
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
