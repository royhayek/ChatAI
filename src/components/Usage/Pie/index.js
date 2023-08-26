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
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const Pie = ({ radius, hasSuffix, activeStrokeWidth, inActiveStrokeWidth }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const messagesCount = useSelector(getMessagesCount);
  const config = useSelector(getConfiguration);
  const dailyMessagesLimit = config?.other?.dailyMessagesLimit;
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();

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
      valueSuffixStyle={{ fontSize: 16 }}
      valuePrefixStyle={{ fontSize: 16 }}
      activeStrokeWidth={activeStrokeWidth}
      inActiveStrokeWidth={inActiveStrokeWidth}
      progressValueColor={theme.dark ? theme.colors.white : theme.colors.black}
      activeStrokeColor={theme.colors.primary}
      inActiveStrokeColor={theme.dark ? theme.colors.pieBlue : theme.colors.secondary}
      valuePrefix={hasSuffix && isRTL ? suffix : ''}
      valueSuffix={hasSuffix && !isRTL ? suffix : ''}
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
