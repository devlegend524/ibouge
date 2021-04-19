import axios from 'axios';

export const loadInbox = (id) => {
  return axios.get(`/users/inbox?id=${id}`);
};
