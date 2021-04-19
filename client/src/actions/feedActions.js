import {
  GET_ALL_STATUS_LOADING,
  DELETE_STATUS_LOADING,
  POST_NEW_DATA_LOADING,
  ADD_OR_REMOVE_LIKE,
  ADD_OR_REMOVE_REPLY,
} from './action_types/feed';

export const getAllStatusUpdates = () => ({
  type: GET_ALL_STATUS_LOADING,
});

export const deleteStatus = (data) => ({
  type: DELETE_STATUS_LOADING,
  payload: data,
});
export const postNewStatus = (data) => ({
  type: POST_NEW_DATA_LOADING,
  payload: {
    data: data,
  },
});
export const addOrRemoveLike = (payload) => ({
  type: ADD_OR_REMOVE_LIKE,
  payload,
});
export const addOrRemoveReply = (payload) => ({
  type: ADD_OR_REMOVE_REPLY,
  payload,
});
/*
const deleteReply = (reply_id, status_id) => {
    var deferred = $q.defer();
    $timeout(function(){
        if (reply_id && status_id) {
            $http.post('status/delete-reply', {reply_id: reply_id, status_id: status_id}).then(function(response) {
                deferred.resolve(response.data);
            }, function(response) {
                deferred.resolve(response.data);
            });
        } else {
            deferred.reject('Invalid data');
        }
    });
    return deferred.promise;
};



const postNewReply = function (data) {
    var deferred = $q.defer();
    $timeout(function(){
        if (data) {
            $http.post('status/new-reply', data).then(function(response) {
                deferred.resolve(response.data);
            }, function(response) {
                deferred.resolve(response.data);
            });
        } else {
            deferred.reject('Invalid data');
        }
    });
    return deferred.promise;
};

const saveImageToBucketAndCreateStatus = (file, albumName, data) => {
    var deferred = $q.defer();
    $timeout(function(){
        if (file && albumName && data) {
            var fd = new FormData();

            fd.append('file', file);
            fd.append('albumName', albumName);
            fd.append('userId', data.from);
            fd.append('message', data.message);
            fd.append('status_type', data.status_type);
            fd.append('time', data.time);

            $http.post('status/image-status', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) {
                deferred.resolve(response.data);
            }, function(response) {
                deferred.resolve(response.data);
            });
        } else {
            deferred.reject('Invalid data');
        }
    });
    return deferred.promise;
};
*/
