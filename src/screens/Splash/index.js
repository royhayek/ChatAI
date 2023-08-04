import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#eee',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('./assets/splash-lottie.json')}
      />
    </View>
  );
};

export default SplashScreen;
