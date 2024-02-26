import Svg, { G, Path } from 'react-native-svg';
import { ms } from 'react-native-size-matters';
import * as React from 'react';

const StarsIcon = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
    clipRule="evenodd"
    viewBox="0 0 24 24"
    width={ms(34)}
    height={ms(34)}
    {...props}>
    <G fill="currentColor">
      <Path d="M9.85 13.075c3.56 0 6.45 2.89 6.45 6.45 0-3.56 2.89-6.45 6.45-6.45-3.56 0-6.45-2.89-6.45-6.45 0 3.56-2.89 6.45-6.45 6.45zM1.25 18.45c2.373 0 4.3 1.927 4.3 4.3 0-2.373 1.927-4.3 4.3-4.3a4.302 4.302 0 0 1-4.3-4.3c0 2.373-1.927 4.3-4.3 4.3zM3.4 5.55c2.373 0 4.3 1.927 4.3 4.3 0-2.373 1.927-4.3 4.3-4.3a4.302 4.302 0 0 1-4.3-4.3c0 2.373-1.927 4.3-4.3 4.3z" />
    </G>
  </Svg>
);
export default StarsIcon;
