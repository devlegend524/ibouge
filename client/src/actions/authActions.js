import {
  LOGIN_WITH_OAUTH_LOADING,
  LOGIN_WITH_EMAIL_LOADING,
  ACTIVATE_USER_LOADING,
  LOGOUT_LOADING,
  RESEED_DATABASE_LOADING,
  ME_LOADING,
  SET_REMEMBER_ME,
  SET_PROFILE_IMG_LOADING,
} from './action_types/auth';
import {
  RESET_PASSWORD_LOADING,
  SET_RESTORE_EMAIL,
} from './action_types/restorepassword';

export const loadMe = () => ({type: ME_LOADING});

export const loginUserWithEmail = (payload) => ({
  type: LOGIN_WITH_EMAIL_LOADING,
  payload,
});

export const logInUserWithOauth = () => ({
  type: LOGIN_WITH_OAUTH_LOADING,
});

// activate user
export const activeUser = (token, history) => ({
  type: ACTIVATE_USER_LOADING,
  payload: {
    token: token,
    history: history,
  },
});

// Log user out
export const logOutUser = (history) => ({
  type: LOGOUT_LOADING,
  payload: history,
});

export const reseedDatabase = () => ({
  type: RESEED_DATABASE_LOADING,
});

export const toggleRememberMe = (isChecked) => {
  const date = new Date();
  let rememberMe = undefined;
  var expires = new Date(date);
  if (isChecked) {
    rememberMe = date.getTime().toString();
    expires.setMonth(expires.getMonth() + 1);
  } else {
    expires.setFullYear(1970);
  }

  // document.cookie.put("remember_me", rememberMe, { expires: expires });
  return {
    type: SET_REMEMBER_ME,
    payload: rememberMe,
  };
};

export const setRestoreEmail = (payload) => ({
  type: SET_RESTORE_EMAIL,
  payload,
});
export const resetPassword = (payload) => ({
  type: RESET_PASSWORD_LOADING,
  payload,
});
export const setProfilePic = (payload) => ({
  type: SET_PROFILE_IMG_LOADING,
  payload,
});
// try {
//   await axios.get('/api/users/reseed');

//   dispatch({
//     type: RESEED_DATABASE_SUCCESS,
//   });
//   dispatch(logOutUser());
//   dispatch(getMessages());
// } catch (err) {
//   dispatch({
//     type: RESEED_DATABASE_FAIL,
//     payload: { error: err?.response?.data.message || err.message },
//   });
// }
