import {
  GET_ALL_STATUS_LOADING,
  GET_ALL_STATUS_SUCCESS,
  DELETE_STATUS_LOADING,
  DELETE_STATUS_SUCCESS,
  POST_NEW_DATA_SUCCESS,
  ADD_OR_REMOVE_LIKE,
  ADD_OR_REMOVE_REPLY,
} from '../actions/action_types/feed';

const initialState = {
  statuses: [],
  isLoading: false,
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

const feedReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_ALL_STATUS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_STATUS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_ALL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        statuses: payload,
      };
    case POST_NEW_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        statuses: [payload, ...state.statuses],
      };
    case DELETE_STATUS_SUCCESS:
      return {
        ...state,
        statuses: state.statuses.filter((status) => status._id !== payload.id),
        isLoading: false,
      };
    case ADD_OR_REMOVE_LIKE:
      return {
        ...state,
        statuses: [
          state.statuses[payload.a].likes.splice(payload.key, payload.key + 1),
        ],
        isLoading: false,
      };
    case ADD_OR_REMOVE_REPLY:
      return {
        ...state,
        statuses: [
          state.statuses[payload.a].replies[payload.r].likes.splice(
            payload.key,
            payload.key + 1
          ),
        ],
        isLoading: false,
      };
    default:
      return state;
  }
};
export default feedReducer;
