import { combineReducers } from 'redux';

import userInfo from './userReducers';
import errors from './errorReducers';
import chats from './chatReducers';
import dashControls from './dashControlReducers';
import forms from './formReducers';
import contacts from './contactReducers';

export default combineReducers({
  userInfo,
  errors,
  chats,
  dashControls,
  forms,
  contacts
});
