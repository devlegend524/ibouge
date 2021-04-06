import axios from 'axios';

export const getAllStatusUpdates = () => {
    return axios.get('/status/getStatus')
}
export const deleteStatus = (id, from) => {
    return axios.post('/status/delete-status', {id: id, from: from})
}

export const deleteReply = (reply_id, status_id) => {
    return axios.post('/status/delete-status', {reply_id: reply_id, status_id: status_id})
}

export const postNewStatus = (data) => {
    return axios.post('/status/new-status', data)
}
export const postNewReply = (data) => {
    return axios.post('/status/new-reply', data)
}

export const saveImageToBucketAndCreateStatus = (file, albumName, data) => {
    const fd = new FormData();

    fd.append('file', file);
    fd.append('albumName', albumName);
    fd.append('userId', data.from);
    fd.append('message', data.message);
    fd.append('status_type', data.status_type);
    fd.append('time', data.time);
    return axios.post('/status/image-status', fd)
}
export const saveImageToBucket = (file, albumName, data) => {
    const fd = new FormData();

    fd.append('file', file);
    fd.append('filename', file.name);

    fd.append('albumName', albumName);

    fd.append('userId', data.from);
    fd.append('message', data.message);
    fd.append('status_type', data.status_type);
    fd.append('time', data.time);
    fd.append('likes', data.likes);

    return axios.post('/s3Bucket/image-to-album', fd)
}