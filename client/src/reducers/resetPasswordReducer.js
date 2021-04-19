import {
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUCCESS,
  SET_RESTORE_EMAIL,
} from '../actions/action_types/restorepassword';
/**
 * export const RESTORE_EMAIL_LOADING = 'RESTORE_EMAIL_LOADING';
export const RESTORE_EMAIL_SUCCESS = 'RESTORE_EMAIL_SUCCESS';
export const RESTORE_EMAIL_FAILED = 'RESTORE_EMAIL_FAILED';
 */
const initialState = {
  isLoading: false,
  restoreEmail: '',
  status: false,
  message: null,
};

const resetPasswordReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case RESET_PASSWORD_LOADING:
      return {
        ...state,
        isLoading: true,
        status: false,
        message: null,
      };
    case RESET_PASSWORD_SUCCESS:
      // localStorage.setItem('token', payload.token);
      return {
        ...state,
        isLoading: false,
        restoreEmail: '',
        status: true,
        message: payload,
      };
    case SET_RESTORE_EMAIL:
      return {
        ...state,
        restoreEmail: payload,
        message: null,
      };
    default:
      return state;
  }
};
export default resetPasswordReducer;
