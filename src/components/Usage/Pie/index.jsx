// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useMemo } from 'react';
import PT from 'prop-types';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import CircularProgress from 'react-native-circular-progress-indicator';
import { isRTL } from 'app/src/config/i18n';
import { DAILY_USAGE_LIMIT } from 'app/src/config/constants';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const Pie = ({ radius, hasSuffix, activeStrokeWidth, inActiveStrokeWidth }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const messagesCount = useSelector(state => state.app.messagesCount);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();

  const suffix = ` / ${DAILY_USAGE_LIMIT}`;
  const availableMsgsCount = useMemo(() => DAILY_USAGE_LIMIT - messagesCount, [messagesCount]);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ---------------------- RENDERERS ------------------------ //
  return (
    <CircularProgress
      radius={radius}
      value={availableMsgsCount}
      maxValue={DAILY_USAGE_LIMIT}
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
