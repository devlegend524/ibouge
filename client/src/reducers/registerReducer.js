import {
  REGISTER_WITH_EMAIL_LOADING,
  REGISTER_WITH_EMAIL_SUCCESS,
  REGISTER_WITH_EMAIL_FAIL,
  REGISTER_RESEND_EMAIL_LOADING,
  REGISTER_RESEND_EMAIL_SUCCESS,
  REGISTER_RESEND_EMAIL_FAIL,
  SET_PROFILE_SUCCESS,
  SET_PROFILE_FAIL
} from '../actions/action_types/auth';

const initialState = {
  isLoading: false,
  message: '',
  error: null,
  state: '',
  account_type: '',
  user: {},
};

const registerReducer =  (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTER_WITH_EMAIL_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case REGISTER_WITH_EMAIL_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
        error: null,
      };
    case SET_PROFILE_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
        error: null,
      };
    case SET_PROFILE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case REGISTER_WITH_EMAIL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case REGISTER_RESEND_EMAIL_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case REGISTER_RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case REGISTER_RESEND_EMAIL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    default:
      return state;
  }
}
export default registerReducer;