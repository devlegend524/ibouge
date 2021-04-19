import {
  REGISTER_WITH_EMAIL_LOADING,
  REGISTER_RESEND_EMAIL_LOADING,
} from './action_types/auth';
import {SET_PROFILE_LOADING, USER_PROFILE_LOADING} from './action_types/users';
export const changeProfilePic = (payload) => ({
  type: USER_PROFILE_LOADING,
  payload,
});

export const registerUserWithEmail = (formData) => ({
  type: REGISTER_WITH_EMAIL_LOADING,
  payload: formData,
});

export const registerResendEmail = (formData) => ({
  type: REGISTER_RESEND_EMAIL_LOADING,
  payload: formData,
});

export const setProfile = (formData) => ({
  type: SET_PROFILE_LOADING,
  payload: formData,
});
