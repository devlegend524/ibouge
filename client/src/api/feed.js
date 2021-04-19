import axios from 'axios';

export const postNewFeed = (data) => {
  return axios.post('status/new-status', data);
};
export const getAllStatus = () => {
  return axios.get('status/getStatus');
};
export const deleteStatus = (id, from) => {
  return axios.post('status/delete-status', {id, from});
};
export const saveImageToBucket = (file, albumName, data) => {
  if (file && albumName && data) {
    var fd = new FormData();

    fd.append('file', file);
    fd.append('filename', file.name);

    fd.append('albumName', albumName);

    fd.append('userId', data.from);
    fd.append('message', data.message);
    fd.append('status_type', data.status_type);
    fd.append('time', data.time);
    fd.append('likes', data.likes);
    return axios.post('s3Bucket/image-to-album', fd);
  }
};
