import {
  NEW_PASSWORD_LOADING,
  NEW_PASSWORD_SUCCESS,
} from '../actions/action_types/restorepassword';
/**
 * export const RESTORE_EMAIL_LOADING = 'RESTORE_EMAIL_LOADING';
export const RESTORE_EMAIL_SUCCESS = 'RESTORE_EMAIL_SUCCESS';
export const RESTORE_EMAIL_FAILED = 'RESTORE_EMAIL_FAILED';
 */
const initialState = {
  isLoading: false,
  status: false,
  message: null,
};

const newpasswordReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case NEW_PASSWORD_LOADING:
      return {
        ...state,
        isLoading: true,
        status: false,
        message: null,
      };
    case NEW_PASSWORD_SUCCESS:
      // localStorage.setItem('token', payload.token);
      return {
        ...state,
        isLoading: false,
        status: true,
        message: payload,
      };

    default:
      return state;
  }
};
export default newpasswordReducer;
