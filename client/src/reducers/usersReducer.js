import {
  GET_USERMETA_FAIL,
  GET_USERMETA_SUCCESS,
  GET_USERS_LOADING,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
} from "../actions/action_types/auth";

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  metaData: [],
  profile: [],
};

const usersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USERS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: payload,
      };
    case GET_USERS_FAIL:
      return {
        ...state,
        isLoading: false,
        users: [],
        error: payload,
      };
    case GET_USERMETA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metaData: payload,
        error: null,
      };
    case GET_USERMETA_FAIL:
      return {
        ...state,
        isLoading: false,
        metaData: [],
        error: payload,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: payload,
        error: null,
      };
    case GET_PROFILE_FAIL:
      return {
        ...state,
        isLoading: false,
        profile: [],
        error: payload,
      };
    default:
      return state;
  }
};
export default usersReducer;
