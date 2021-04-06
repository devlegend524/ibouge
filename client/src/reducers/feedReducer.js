import {
  GET_ALL_STATUS_LOADING,
  GET_ALL_STATUS_SUCCESS,
  GET_ALL_STATUS_FAIL,
  DELETE_STATUS_LOADING,
  DELETE_STATUS_SUCCESS,
  DELETE_STATUS_FAIL,
} from "../actions/action_types/feed";

const initialState = {
  statuses: [],
  isLoading: false,
  error: null,
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

const feedReducer = (state = initialState, { type, payload }) => {
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
        statuses: payload.data,
      };
    case DELETE_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_STATUS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_ALL_STATUS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    default:
      return state;
  }
};
export default feedReducer;
