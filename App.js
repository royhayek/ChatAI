import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Root from './src/Root';
import { persistor, store } from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
}
