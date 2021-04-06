import {
  LOGIN_WITH_OAUTH_LOADING,
  LOGIN_WITH_OAUTH_SUCCESS,
  LOGOUT_SUCCESS,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_EMAIL_SUCCESS,
  LOGIN_WITH_EMAIL_FAIL,
  ME_LOADING,
  ME_SUCCESS,
  ME_FAIL,
  GET_PROFILE_LOADING,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  EDIT_USER_LOADING,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAIL,
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  GET_USERMETA_LOADING,
  GET_USERMETA_SUCCESS,
  GET_USERMETA_FAIL,
} from '../actions/action_types/auth';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sess: {},
  profile: {},
  userMeta: {},
};

const authReducer = (state = initialState, { type, payload }) => {
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
    case ME_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        sess: null,
        error: null,
        appLoaded: true,
      };
    case LOGOUT_SUCCESS:
    case LOGIN_WITH_EMAIL_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: payload, //payload message ovde i razdvoj logout i fail
      };
    case GET_PROFILE_LOADING:
    case EDIT_USER_LOADING:
    case DELETE_USER_LOADING:
    case GET_USERMETA_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: payload.profile,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: payload.user,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: {},
      };
    case GET_USERMETA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userMeta: payload.userMeta,
      };
    case GET_PROFILE_FAIL:
    case EDIT_USER_FAIL:
    case DELETE_USER_FAIL:
    case GET_USERMETA_FAIL:
      return {
        ...state,
        isLoading: false,
        profile: {},
        userMeta: {},
        error: payload.error,
      };
    default:
      return state;
  }
}
export default authReducer;
