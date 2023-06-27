import appReducer from './slices/appSlice';
import { combineReducers } from 'redux';

export default combineReducers({
  app: appReducer,
});
