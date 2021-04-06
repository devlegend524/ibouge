import { combineReducers } from "redux";

import commonReducer from "./commonReducer";
import authReducer from "./authReducer";
import registerReducer from "./registerReducer";
import usersReducer from "./usersReducer";
import messageReducer from "./messageReducer";
import feedReducer from "./feedReducer";
import resetPasswordReducer from "./resetPasswordReducer";
import newpasswordReducer from "./newpasswordReducer";
import microblogReducer from "./microblogReducer";
import eventReducer from "./eventReducer";

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
  blogs: microblogReducer,
});
