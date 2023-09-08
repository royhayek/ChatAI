import { batchedSubscribe } from 'redux-batched-subscribe';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootReducer from './reducers';
import { debounce } from 'lodash';
import thunk from 'redux-thunk';

const debounceNotify = debounce(notify => notify(), 10);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
  enhancers: [batchedSubscribe(debounceNotify)],
});

export const persistor = persistStore(store);
