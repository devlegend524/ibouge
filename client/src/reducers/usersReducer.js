import {
  GET_USERMETA_SUCCESS,
  GET_USERS_LOADING,
  GET_USERS_SUCCESS,
  GET_PROFILE_SUCCESS,
  GET_FRIENDS_SUCCESS,
} from '../actions/action_types/users';

const initialState = {
  users: [],
  isLoading: false,
  metaData: [],
  profile: [],
  friends: [],
};

const usersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_USERS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: payload,
      };

    case GET_USERMETA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metaData: payload,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: payload,
      };
    case GET_FRIENDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        friends: payload,
      };
    default:
      return state;
  }
};
export default usersReducer;
