import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/chat';
import * as api from '../api/chat';
import * as helper from '../helpers/chat';
const auth = (state) => state.auth;
const active_chats = (state) => state.chat.chats;

function* openChat(action) {
  const user = yield select(auth);
  const current_chats = yield select(active_chats);
  const room = helper.generateRoomName(user.sess._id, action.payload._id);
  const chat = {
    isGroupChat: false,
    me: user.sess,
    friends: action.payload,
    room: room,
    limit: 20,
    offset: 0,
    messages: [],
  };
  const is_exist = current_chats.filter((active) => active.room === room);
  console.log('trying to open chat', is_exist);
  if (is_exist.length < 1) {
    try {
      const response = yield call(api.loadChatHistory, chat);
      if (response.data) {
        const messages = response.data.map((item) => {
          let readAt = 'unread';
          if (item.read_at) {
            readAt = 'Read at: ' + item.read_at;
          }
          const chatMsg = {
            from: item.from,
            time: item.time,
            read_at: readAt,
            msg: item.message ? helper.linkify(item.message) : '',
          };
          chatMsg.in = item.from !== chat.me._id;
          return chatMsg;
        });
        for (let i = 0; i < messages.length; i++) {
          chat.messages.unshift(messages[i]);
        }
        chat.offset += messages.length;
      }
      yield put({
        type: types.PERSONAL_CHAT_SUCCESS,
        payload: {
          show: true,
          chat: chat,
        },
      });
    } catch (err) {
      console.log('error loading chat history', err);
      yield put({
        type: types.PERSONAL_CHAT_SUCCESS,
        payload: {
          show: true,
          chat: chat,
        },
      });
    }
  }
}

function* watchOpenChat() {
  // create watcher of fetchData function
  yield takeEvery(types.PERSONAL_CHAT_LOADING, openChat);
}

const chatSaga = [fork(watchOpenChat)];

export default chatSaga;
