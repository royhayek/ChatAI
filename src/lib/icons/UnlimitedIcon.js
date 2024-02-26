import { ms } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import * as React from 'react';

const UnlimitedIcon = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={ms(34)} height={ms(34)} viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      d="M17.9 7c-2.2 0-3.8 1.6-4.3 2.1l1.4 1.4c.4-.4 1.5-1.5 2.9-1.5 1.3 0 3.1.9 3.1 3s-1.8 3-3.1 3c-2.2 0-3.3-1.4-5-3.4l-.3-.4C10.8 8.9 9.2 7 6.1 7 3.6 7 1 8.9 1 12s2.6 5 5.1 5c2.2 0 3.4-1.1 4.3-2.1.4-.4.4-1 0-1.4s-1-.4-1.4 0c-.8.8-1.5 1.5-2.9 1.5-1.3 0-3.1-.9-3.1-3s1.8-3 3.1-3c2.2 0 3.3 1.4 5 3.4l.3.4c1.8 2.2 3.4 4.2 6.5 4.2 2.5 0 5.1-1.9 5.1-5s-2.6-5-5.1-5z"
    />
  </Svg>
);
export default UnlimitedIcon;
