// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useMemo } from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import PT from 'prop-types';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { getConfiguration, getMessagesCount } from 'app/src/redux/selectors';
import { isRTL } from 'app/src/config/i18n';
import useStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const Pie = ({ radius, hasSuffix, activeStrokeWidth, inActiveStrokeWidth }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const messagesCount = useSelector(getMessagesCount);
  const config = useSelector(getConfiguration);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = useStyles(theme);

  const dailyMessagesLimit = config?.other?.dailyMessagesLimit;
  const suffix = ` / ${dailyMessagesLimit}`;
  const availableMsgsCount = useMemo(() => dailyMessagesLimit - messagesCount, [dailyMessagesLimit, messagesCount]);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ---------------------- RENDERERS ------------------------ //
  return (
    <CircularProgress
      radius={radius}
      value={availableMsgsCount}
      maxValue={dailyMessagesLimit}
      inActiveStrokeOpacity={0.5}
      valueSuffixStyle={styles.valueText}
      valuePrefixStyle={styles.valueText}
      activeStrokeWidth={activeStrokeWidth}
      activeStrokeColor={theme.colors.primary}
      inActiveStrokeWidth={inActiveStrokeWidth}
      valuePrefix={hasSuffix && isRTL ? suffix : ''}
      valueSuffix={hasSuffix && !isRTL ? suffix : ''}
      progressValueColor={theme.dark ? theme.colors.white : theme.colors.black}
      inActiveStrokeColor={theme.dark ? theme.colors.pieBlue : theme.colors.secondary}
    />
  );
};

Pie.propTypes = {
  radius: PT.number.isRequired,
  hasSuffix: PT.bool,
};

Pie.defaultProps = {
  radius: 30,
  hasSuffix: false,
};

export default Pie;
