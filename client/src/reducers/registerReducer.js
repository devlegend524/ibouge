import {
  REGISTER_WITH_EMAIL_LOADING,
  REGISTER_WITH_EMAIL_SUCCESS,
  REGISTER_RESEND_EMAIL_LOADING,
  REGISTER_RESEND_EMAIL_SUCCESS,
} from '../actions/action_types/auth';
const initialState = {
  isLoading: false,
  message: '',
  state: '',
  account_type: '',
  user: {},
};

const registerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case REGISTER_WITH_EMAIL_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case REGISTER_WITH_EMAIL_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
      };

    case REGISTER_RESEND_EMAIL_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case REGISTER_RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default registerReducer;
