import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import Root from './src/Root';
import { persistor, store } from './src/redux/store';
import 'react-native-url-polyfill/auto';
import 'src/config/i18n';

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
}
