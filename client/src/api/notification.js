import axios from 'axios';

export const loadNotification = (id) => {
  return axios.get(`/users/notifications?id=${id}`);
};
