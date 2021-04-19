import {
  GROUP_CHAT_LOADING,
  PERSONAL_CHAT_LOADING,
  SET_CTRL,
  CLOSE_CHAT,
} from './action_types/chat';

export const openGroupChat = (payload) => ({
  type: GROUP_CHAT_LOADING,
  payload,
});
export const openPersonalChat = (payload) => ({
  type: PERSONAL_CHAT_LOADING,
  payload,
});
export const openChatRequest = (payload) => ({
  type: SET_CTRL,
  payload,
});
export const closeCurrentChat = (payload) => ({
  type: CLOSE_CHAT,
  payload,
});
export const goGoChat = ({item, user_id}) => {};
