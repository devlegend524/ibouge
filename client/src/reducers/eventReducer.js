import {
  GET_EVENTS_SUCCESS,
  ADD_EVENT_LIKE,
} from '../actions/action_types/event';

const initialState = {
  events: [],
  isLoading: false,
};

const eventReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        events: payload,
      };
    case ADD_EVENT_LIKE:
      if (payload.action === 'add') {
        return {
          ...state,
          events: [state.events[payload.key].likes.push(payload.value)],
        };
      } else if (payload.action === 'remove') {
        return {
          ...state,
          events: [
            state.events[payload.key].likes.splice(
              payload.value,
              payload.value + 1
            ),
          ],
        };
      }
    default:
      return state;
  }
};
export default eventReducer;
