import {createAction} from 'redux-act';
import {
  GET_MESSAGES_LOADING,
  ADD_MESSAGE_LOADING,
  DELETE_MESSAGE_LOADING,
  EDIT_MESSAGE_LOADING,
} from './action_types/message';

export const login = createAction('login');
export const logout = createAction('logout');

export const addUser = createAction('add user');
export const removeUser = createAction('remove user');

export const newMessage = createAction('new message');

export const sendMessage = (payload) => ({
  type: GET_MESSAGES_LOADING,
  payload,
});
