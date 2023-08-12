// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useState } from 'react';
import { useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const SplashScreen = () => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [showSplash, setShowSplash] = useState(true);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleAnimationFinish = useCallback(() => setShowSplash(false), []);
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  if (showSplash) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LottieView
          autoPlay
          loop={false}
          style={styles.lottie}
          onAnimationFinish={handleAnimationFinish}
          source={require('../../../assets/splash-lottie.json')}
        />
      </View>
    );
  }

  return null;
};

export default SplashScreen;
