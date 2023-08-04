import AsyncStorage from '@react-native-async-storage/async-storage';
import appReducer from './slices/appSlice';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

const appPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['messagesCount', 'lastSentDate', 'subProducts'],
};

export default combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
});
