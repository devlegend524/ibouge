import axios from 'axios';

export const getMicroblog = (_id, room) => {
  return axios.get(`/microblog/${room}?id=${_id}`);
};

export const getAllMicroblogs = () => {
  return axios.get('/microblog/allmicroblogs');
};

export const getMicroblogForInvitee = (creator, room) => {
  return axios.get(`/microblog/${room}?id=${creator}`);
};

export const changeMicroblogPic = (creator, data) => {
  return axios.post(`/microblog/microblogpic/${data}`, data);
};

export const getMyMicroblogs = (_id) => {
  return axios.get(`/microblogs?id=${_id}`);
};

export const createMicroblog = (_id, data) => {
  data.id = _id;
  // if session user does not exist in the data object
  if (data.users.indexOf(data.id) < 0) {
    // push my id in data.users array
    data.users.push(data.id);
  }
  var microblogId = Date.now().toString();
  // create form for data
  var fd = new FormData();

  fd.append('userId', _id);
  fd.append('users', data.users);
  fd.append('room', microblogId);
  fd.append('isMicroblog', 'true');
  fd.append('microblogName', data.name);
  fd.append('albumName', data.albumName);
  fd.append('coordinates0', data.coordinates[0]);
  fd.append('coordinates1', data.coordinates[1]);
  if (data.microblogImgFile) {
    fd.append('file', data.microblogImgFile);
  }
  return axios.post('/microblog', fd);
};

export const addMeToAllInvolved = (data) => {
  return axios.post('/microblog/add-me-to-allInvolved', data);
};

export const updateAllInvolvedArray = (data) => {
  return axios.post('/microblog/update-all-involved-array', data);
};
export const uploadImageMessage = (data) => {
  return axios.post('/microblog/update-all-involved-array', data);
};
export const loadMicroblogs = (uid) => {
  return axios.get(`/users/microblogs?id=${uid}`);
};
export const updateUserBookmarkedMicroblogs = (user, microblogRoom) => {
  return axios.post('/users/update-user-bookmarked-microblogs', {
    me: user,
    room: microblogRoom,
  });
};
export const unbookmarkMicroblog = (user, microblogRoom) => {
  return axios.post('/users/unbookmark-microblog', {
    me: user,
    room: microblogRoom,
  });
};
export const loadMicroblogHistory = (microblog, id) => {
  return axios.get(
    `/microblog/history/${microblog.room}?limit=${microblog.limit}&offset=${microblog.offset}&id=${id}`
  );
};

export const addMicroblogNotification = (data) => {
  return axios.post('/microblog/notification', data);
};
export const removeUserFromMicroblog = (data) => {
  return axios.post('/microblog/remove-user', data);
};

// this.updateUserBookmarkedMicroblogs = function (user, microblogRoom) {
//   var deferred = $q.defer();
//   var reqData = {
//     me: user,
//     room: microblogRoom,
//   };
//   $http.post('users/update-user-bookmarked-microblogs', reqData).then(
//     function (response) {
//       deferred.resolve(response.data);
//     },
//     function (response) {
//       deferred.reject(response.data);
//     }
//   );
//   return deferred.promise;
// };

// this.unbookmarkMicroblog = function (user, microblogRoom) {
//   var deferred = $q.defer();
//   var reqData = {
//     me: user,
//     room: microblogRoom,
//   };
//   $http.post('users/unbookmark-microblog', reqData).then(
//     function (response) {
//       deferred.resolve(response.data);
//     },
//     function (response) {
//       deferred.reject(response.data);
//     }
//   );
//   return deferred.promise;
// };
