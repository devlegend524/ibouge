import axios from 'axios';

export const getLocation = () => {
    return axios.get('https://ipinfo.io')
}

export const updateUser = (email, data) => {
    return axios.put(`/users/${email}`, data)
}

export const changeProfilePic = (email, data) => {
    var fd = new FormData();
    fd.append("userId", data.userId);
    fd.append("userEmail", email);
    fd.append("albumName", data.albumName);
    if (data.file) {
        fd.append("file", data.file);
    }
    if (data.originalFile) {
        fd.append("originalFile", data.originalFile);
    }
    return axios.post(`/users/profilepic/${email}`, fd)
}

export const loadMeta = (id) => {
    return axios.get(`/users/meta?id=${id}`)
}
export const getUserMeta = (id) => {
    return axios.get(`/users/get-user-meta?id=${id}`)
}
export const getAllUsers = (id) => {
    return axios.get(`/users/get-all-users?id=${id}`)
}
// data api calls
export const getMyFriends = (id) => {
    return axios.get(`/users/friends?id=${id}`)
}

export const getProfileFriends = (uid, pid) => {
    return axios.get(`/users/friends?id=${uid}&profile=${pid}`)
}
export const loadBlockList = (email) => {
    return axios.get(`/users/blocklist?email=${email}`)
}
export const loadInbox = (uid) => {
    return axios.get(`/users/inbox?id=${uid}`)
}
export const loadNotifications = (uid) => {
    return axios.get(`/users/notifications?id=${uid}`)
}
export const loadMicroblogs = (uid) => {
    return axios.get(`/users/microblogs?id=${uid}`)
}
export const updateUserBookmarkedMicroblogs = (user, microblogRoom) => {
    return axios.post('/users/update-user-bookmarked-microblogs', {me: user, room: microblogRoom})
}
export const unbookmarkMicroblog = (user, microblogRoom) => {
    return axios.post('/users/unbookmark-microblogs', {me: user, room: microblogRoom})
}
export const sendFriendRequest = (uId, friendId) => {
    return axios.post('/users/friend-request', {id: uId, friend: friendId})
}
export const getUserProfile = (_id, userId) => {
    return axios.get(`/users/profile?id=${_id}&user=${userId}`)
}
export const acceptFriendRequest = (_id, userId) => {
    return axios.post('/users/accept-friend-request', {id: _id, user: userId})
}

export const unfriend = (_id, userId) => {
    return axios.post('/users/unfriend', {id: _id, user: userId})
}

export const getMyDashboardMetaData = (_id) => {
    return axios.get(`/my-dashboard/meta?id=${_id}`)
}
