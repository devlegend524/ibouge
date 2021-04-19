import {
  GET_MESSAGES_LOADING,
  GET_MESSAGES_SUCCESS,
  ADD_MESSAGE_LOADING,
  ADD_MESSAGE_SUCCESS,
  DELETE_MESSAGE_LOADING,
  DELETE_MESSAGE_SUCCESS,
  EDIT_MESSAGE_LOADING,
  EDIT_MESSAGE_SUCCESS,
} from '../actions/action_types/message';

const initialState = {
  isOpen: false,
  hasNewMessage: false,
  data: [],
  unread: 0,
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

const messageReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_MESSAGES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_MESSAGE_LOADING:
      return {
        ...state,
        messages: [
          {
            id: 0,
            text: 'Loading...',
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {...payload.me},
          },
          ...state.messages,
        ],
      };
    case DELETE_MESSAGE_LOADING:
    case EDIT_MESSAGE_LOADING:
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id === payload.id) return {...m, isLoading: true};
          return m;
        }),
      };
    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: payload.messages,
      };
    case ADD_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id === 0) return payload.message;
          return m;
        }),
      };
    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== payload.message.id),
      };
    case EDIT_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id === payload.message.id) return payload.message;
          return m;
        }),
      };

    default:
      return state;
  }
};
export default messageReducer;
