import {MY_INBOX_SUCCESS} from '../actions/action_types/inbox';

const initialState = {
  isOpen: false,
  hasNewMessage: false,
  data: [],
  unread: 0,
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

const inboxReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case MY_INBOX_SUCCESS:
      return {
        ...state,
        data: payload,
      };
    default:
      return state;
  }
};
export default inboxReducer;
