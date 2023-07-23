import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import * as Icons from '../../../assets/icons';
import { View } from 'react-native';
import { isRTL } from '../../config/i18n';

const Icon = ({ name, size, style, iconStyle, transform, ...rest }) => {
  try {
    // console.debug('[Icon] :: ', { Icons });
    const IconComponent = _.has(Icons, name) ? Icons[name] : Icons.info;
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
        <IconComponent
          width={size}
          height={size}
          style={[isRTL && transform ? { transform: [{ scaleX: -1 }] } : {}, iconStyle]}
          {...rest}
        />
      </View>
    );
  } catch (err) {
    console.warn(err);
    return null;
  }
};

Icon.propTypes = {
  name: PT.string.isRequired,
  size: PT.oneOfType([
    PT.number,
    PT.shape({
      w: PT.number,
      h: PT.number,
    }),
  ]),
  style: PT.oneOfType([PT.object, PT.func, PT.array]),
  transform: PT.bool,
};

Icon.defaultProps = {
  transform: true,
  size: 32,
  name: 'logo',
};

export default Icon;
