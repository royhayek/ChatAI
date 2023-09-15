// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const SplashScreen = ({ loadedData }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [showSplash, setShowSplash] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleAnimationFinish = useCallback(async () => {
    setAnimationFinished(true);
    loadedData && setShowSplash(false);
  }, [loadedData]);
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ------------------------ EFFECTS ------------------------ //
  useEffect(() => {
    loadedData && animationFinished && setShowSplash(false);
  }, [animationFinished, loadedData]);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  if (showSplash) {
    return (
      <View style={styles.container}>
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
