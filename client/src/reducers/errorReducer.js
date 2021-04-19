import {
  LOGIN_WITH_EMAIL_FAIL,
  ME_FAIL,
  REGISTER_WITH_EMAIL_FAIL,
  REGISTER_RESEND_EMAIL_FAIL,
} from '../actions/action_types/auth';
import {
  GET_PROFILE_FAIL,
  EDIT_USER_FAIL,
  DELETE_USER_FAIL,
  GET_USERMETA_FAIL,
  GET_USERS_FAIL,
  SET_PROFILE_FAIL,
} from '../actions/action_types/users';
import {GET_EVENTS_FAILED} from '../actions/action_types/event';
import {
  GET_ALL_STATUS_FAIL,
  DELETE_STATUS_FAIL,
} from '../actions/action_types/feed';
import {
  GET_MESSAGES_FAIL,
  ADD_MESSAGE_FAIL,
  DELETE_MESSAGE_FAIL,
  EDIT_MESSAGE_FAIL,
  CLEAR_MESSAGE_ERROR,
} from '../actions/action_types/message';
import {GET_MICROBLOGS_FAILED} from '../actions/action_types/microblog';
import {NEW_PASSWORD_FAILED} from '../actions/action_types/restorepassword';
import {RESET_PASSWORD_FAILED} from '../actions/action_types/restorepassword';

const initialState = {
  user_login: null,
  load_me: null,
  get_profile: null,
  edit_user: null,
  delete_user: null,
  get_metadata: null,
  get_user: null,
  register_email: null,
  register_resend_email: null,
  get_event: null,
  set_profile: null,
  get_all_status: null,
  delete_status: null,
  get_message: null,
  add_message: null,
  edit_message: null,
  delete_message: null,
  clear_message: null,
  get_microblog: null,
  new_password: null,
  reset_password: null,
};
const errorReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_EVENTS_FAILED:
      return {
        ...state,
        get_event: payload,
      };
    case ME_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        load_me: null,
      };
    case LOGIN_WITH_EMAIL_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        user_login: payload, //payload message ovde i razdvoj logout i fail
      };
    case GET_PROFILE_FAIL:
      return {
        ...state,
        get_profile: payload.error,
      };
    case EDIT_USER_FAIL:
      return {
        ...state,
        edit_user: payload.error,
      };
    case DELETE_USER_FAIL:
      return {
        ...state,
        delete_user: payload.error,
      };
    case GET_USERMETA_FAIL:
      return {
        ...state,
        get_metadata: payload.error,
      };
    case DELETE_STATUS_FAIL:
      return {
        ...state,
        delete_status: payload.error,
      };
    case GET_ALL_STATUS_FAIL:
      return {
        ...state,
        get_all_status: payload.error,
      };
    case DELETE_MESSAGE_FAIL:
      return {
        ...state,
        delete_message: payload.error,
      };
    case EDIT_MESSAGE_FAIL:
      return {
        ...state,
        edit_message: payload.error,
      };
    case GET_MESSAGES_FAIL:
      return {
        ...state,
        get_message: payload.error,
      };
    case ADD_MESSAGE_FAIL:
      return {
        ...state,
        add_message: payload.error,
      };
    case CLEAR_MESSAGE_ERROR:
      return {
        ...state,
        clear_message: payload.error,
      };
    case GET_MICROBLOGS_FAILED:
      return {
        ...state,
        get_microblog: payload,
      };
    case SET_PROFILE_FAIL:
      return {
        ...state,
        set_profile: payload.error,
      };
    case REGISTER_WITH_EMAIL_FAIL:
      return {
        ...state,
        register_email: payload.error,
      };
    case REGISTER_RESEND_EMAIL_FAIL:
      return {
        ...state,
        register_resend_email: payload.error,
      };
    case RESET_PASSWORD_FAILED:
      return {
        ...state,
        reset_password: payload.error,
      };
    case GET_USERS_FAIL:
      return {
        ...state,
        get_user: payload.error,
      };
    case NEW_PASSWORD_FAILED:
      return {
        ...state,
        new_password: payload.error,
      };
    default:
      return state;
  }
};
export default errorReducer;
