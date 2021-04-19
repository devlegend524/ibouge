import {
  SET_CTRL,
  GROUP_CHAT_SUCCESS,
  PERSONAL_CHAT_SUCCESS,
  CLOSE_CHAT,
} from '../actions/action_types/chat';

const initialState = {
  ctrl: {
    show: false,
  },
  chats: [],
  File: {},
  isFileSelected: false,
  imageInfo: {},
};

const chatReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CTRL:
      return {
        ...state,
        ctrl: payload,
      };
    case PERSONAL_CHAT_SUCCESS:
      return {
        ...state,
        ctrl: {
          ...state.ctrl,
          show: payload.show,
        },
        chats: [payload.chat, ...state.chats],
      };
    case CLOSE_CHAT:
      return {
        ...state,
        chats: state.chats.filter((chat) => chat !== payload),
        ctrl: {
          ...state.ctrl,
          show: state.chats.length ? true : false,
        },
      };
    default:
      return state;
  }
};
export default chatReducer;
