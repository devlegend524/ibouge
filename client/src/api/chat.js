import axios from 'axios';

export const getChat = (_id, room) => {
  return axios.get(`/chat/${room}?id=${_id}`);
};

export const loadChatHistory = (chat) => {
  return axios.get(`/chat/history/${chat.room}`);
};
export const createGroupChat = (_id, data) => {
  if (data.name && data.users) {
    data.id = _id;
    if (data.users.indexOf(data.id) < 0) {
      data.users.push(data.id);
    }
  }
  return axios.post('/chat/group/', data);
};
