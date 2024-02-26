import { ms } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import * as React from 'react';

const NoAdsIcon = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={ms(34)} height={ms(34)} viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      d="M11.5 13.7 10 8.2c-.2-.4-.6-.7-1-.7s-.8.3-1 .7l-1.6 5.5-.4 1.5v.3c0 .4.3.8.7 1 .5.1 1.1-.2 1.2-.7l.3-.8h1.6l.2.8c.1.4.5.7 1 .7h.3c.4-.1.7-.5.7-1v-.3zM8.8 13l.2-.9.2.9zM12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm7 16.6-.8-.8c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l.8.8c-1.5 1.2-3.5 2-5.6 2-5 0-9-4-9-9 0-2.1.7-4.1 2-5.6l.8.8c.2.2.4.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L6.4 5C7.9 3.7 9.9 3 12 3c5 0 9 4 9 9 0 2.1-.7 4.1-2 5.6zM13.5 7.5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1 3.1 0 5-1.7 5-4.5s-1.9-4.5-5-4.5zm1 6.9V9.6c1.3.3 2 1.1 2 2.4s-.7 2.2-2 2.4z"
    />
  </Svg>
);
export default NoAdsIcon;
