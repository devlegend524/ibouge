import {combineReducers} from 'redux';

import commonReducer from './commonReducer';
import authReducer from './authReducer';
import registerReducer from './registerReducer';
import usersReducer from './usersReducer';
import messageReducer from './messageReducer';
import feedReducer from './feedReducer';
import resetPasswordReducer from './resetPasswordReducer';
import newpasswordReducer from './newpasswordReducer';
import microblogReducer from './microblogReducer';
import eventReducer from './eventReducer';
import errorReducer from './errorReducer';
import notificationReducer from './notificationReducer';
import inboxReducer from './inboxReducer';
import chatReducer from './chatReducer';
export default combineReducers({
  common: commonReducer,
  auth: authReducer,
  register: registerReducer,
  message: messageReducer,
  users: usersReducer,
  feed: feedReducer,
  resetpassword: resetPasswordReducer,
  newpassword: newpasswordReducer,
  events: eventReducer,
  inbox: inboxReducer,
  blogs: microblogReducer,
  errors: errorReducer,
  chat: chatReducer,
  notification: notificationReducer,
});
