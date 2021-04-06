import {
  GET_EVENTS_FAILED,
  GET_EVENTS_SUCCESS,
} from "../actions/action_types/event";

const initialState = {
  events: [],
  isLoading: false,
  error: null,
};

const eventReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        events: payload,
      };
    case GET_EVENTS_FAILED:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};
export default eventReducer;
