import {
  NEW_NOTIFICATION,
  NOTIFICATION_LOADING,
  SET_GROUP_CHAT_MODAL_STATUS,
} from './action_types/notification';

export const newNotification = (payload) => ({
  type: NEW_NOTIFICATION,
  payload,
});
export const loadNotifications = () => ({
  type: NOTIFICATION_LOADING,
});
export const setGroupChatModalStatus = (payload) => ({
  type: SET_GROUP_CHAT_MODAL_STATUS,
  payload,
});
