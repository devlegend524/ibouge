import axios from 'axios';

export const loadMe = (options) => {
  return axios.get('/auth/me/' + options);
};
// data api calls
export const loginUserWithEmail = (options) => {
  return axios.post('/auth/login', options);
};

export const logInUserWithOauth = (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': token,
  };
  return axios.post('/auth/me', {headers});
};

export const activeUser = (token) => {
  return axios.post('/auth/activate-account', {token: token});
};

export const logOutUser = () => {
  return axios.get('/auth/signout');
};

export const reseedDatabase = () => {
  return axios.get('/api/users/reseed');
};

export const restorePassword = (restoreEmail) => {
  return axios.post('/auth/restore-password', {email: restoreEmail});
};
export const setProfilePic = (email, data) => {
  if (email && data) {
    // create form for data
    var fd = new FormData();

    fd.append('userId', data.userId);
    fd.append('userEmail', email);
    fd.append('albumName', data.albumName);
    if (data.file) {
      fd.append('file', data.file);
    }
    if (data.originalFile) {
      fd.append('originalFile', data.originalFile);
    }

    // send data to s3 bucket
    return axios.post('/users/profilepic/' + email, fd);
  }
};
export const createNewPassword = (data) => {
  /**
   * 		var reqData = {
			email: $scope.user.email,
			password: $scope.user.password,
			token: options.token
		};
   */
  return axios.post('/auth/new-password', data);
};
