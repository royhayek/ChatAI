import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import { PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from './lib/theme';
import RootNavigation from './navigation';

const Root = () => {
  const themeMode = useSelector(state => state.app.themeMode);
  const isDark = _.isEqual(themeMode, 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <RootNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Root;
