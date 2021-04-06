import axios from "axios";

import {
  GET_ALL_STATUS_LOADING,
  GET_ALL_STATUS_SUCCESS,
  GET_ALL_STATUS_FAIL,
  DELETE_STATUS_LOADING,
  DELETE_STATUS_SUCCESS,
  DELETE_STATUS_FAIL,
} from "./action_types/feed";

export const getAllStatusUpdates = () => async (dispatch, getState) => {
  dispatch({
    type: GET_ALL_STATUS_LOADING,
  });

  try {
    const response = await axios.get("/status/getStatus");

    dispatch({
      type: GET_ALL_STATUS_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    dispatch({
      type: GET_ALL_STATUS_FAIL,
      payload: { error: err?.response?.data || err.message },
    });
  }
};

export const deleteStatus = (id, from) => async (dispatch, getState) => {
  if (id && from) {
    dispatch({
      type: DELETE_STATUS_LOADING,
    });

    try {
      const response = await axios.post("status/delete-status", { id, from });

      dispatch({
        type: DELETE_STATUS_SUCCESS,
        payload: { data: response.data },
      });
    } catch (err) {
      dispatch({
        type: DELETE_STATUS_FAIL,
        payload: { error: err?.response?.data || err.message },
      });
    }
  }
};

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

const postNewStatus = (data) => {
    var deferred = $q.defer();
    $timeout(function(){
        if (data) {
            $http.post('status/new-status', data).then(function(response) {
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
