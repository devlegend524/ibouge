import {
  LOGIN_WITH_OAUTH_LOADING,
  LOGIN_WITH_OAUTH_SUCCESS,
  LOGOUT_SUCCESS,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_EMAIL_SUCCESS,
  ME_LOADING,
  ME_SUCCESS,
  SET_PROFILE_IMG,
} from '../actions/action_types/auth';
import {SET_PROFILE_SUCCESS} from '../actions/action_types/users';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  sess: {},
};

const authReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ME_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_WITH_EMAIL_LOADING:
    case LOGIN_WITH_OAUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_WITH_EMAIL_SUCCESS:
    case LOGIN_WITH_OAUTH_SUCCESS:
      // localStorage.setItem('token', payload.token);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        sess: payload.user,
        current_user: payload.user.email,
        error: null,
      };
    case ME_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        sess: payload.user,
        error: null,
      };
    case SET_PROFILE_SUCCESS:
      return {
        ...state,
        sess: payload,
        isLoading: false,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: payload, //payload message ovde i razdvoj logout i fail
      };
    case SET_PROFILE_IMG:
      return {
        ...state,
        sess: {
          ...state.sess,
          profilePic: payload,
        },
      };
    default:
      return state;
  }
};
export default authReducer;
