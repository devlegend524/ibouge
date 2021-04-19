import axios from 'axios';

import {attachTokenToHeaders} from '../helpers/utils';
import {
  GET_PROFILE_LOADING,
  EDIT_USER_LOADING,
  USER_PROFILE_CHANGE,
  EDIT_USER_FAIL,
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  GET_USERMETA_LOADING,
  GET_USERS_LOADING,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  CANCEL_FRIEND_REQUEST,
  LOAD_META,
  GET_FRIENDS_LOADING,
} from './action_types/users';

import {logOutUser, loadMe} from './authActions';
export const getAllUsers = () => ({type: GET_USERS_LOADING});

export const editUser = (id, formData, history) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: EDIT_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/users/${id}`, formData, options);

    dispatch({
      type: USER_PROFILE_CHANGE,
      payload: {
        user: response.data.user,
      },
    });
    // edited him self, reload me
    if (getState().auth.me?.id === response.data.user.id) dispatch(loadMe());
    history.push(`/${response.data.user.username}`);
  } catch (err) {
    dispatch({
      type: EDIT_USER_FAIL,
      payload: {
        error: err?.response?.data.message || err.message,
      },
    });
  }
};
export const loadMeta = (payload) => ({
  type: LOAD_META,
  payload,
});

export const getUserProfile = (username) => ({
  type: GET_PROFILE_LOADING,
  payload: username,
});

export const deleteUser = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_USER_LOADING,
    payload: {
      id,
    },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/users/${id}`, options);

    //logout only if he deleted himself
    if (getState().auth.me.id === response.data.user.id) {
      dispatch(logOutUser(id, history));
    }
    history.push('/users');
    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: {
        message: response.data.user,
      },
    });
  } catch (err) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: {
        error: err?.response?.data.message || err.message,
      },
    });
  }
};
export const getMyFriends = (userId) => ({
  type: GET_FRIENDS_LOADING,
  payload: userId,
});
export const getUserMeta = (userId) => ({
  type: GET_USERMETA_LOADING,
  payload: userId,
});
export const sendFriendRequest = (friendId) => ({
  type: SEND_FRIEND_REQUEST,
  payload: friendId,
});
export const acceptFriendRequest = (friendId) => ({
  type: ACCEPT_FRIEND_REQUEST,
  payload: friendId,
});
export const unfriend = (friendId) => ({
  type: CANCEL_FRIEND_REQUEST,
  payload: friendId,
});
// export const getUsers = () => async (dispatch, getState) => {
//   dispatch({
//     type: GET_USERS_LOADING,
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get("/api/users", options);

//     dispatch({
//       type: GET_USERS_SUCCESS,
//       payload: {
//         users: response.data.users,
//       },
//     });
//   } catch (err) {
//     dispatch({
//       type: GET_USERS_FAIL,
//       payload: err.message,
//     });
//   }
// };
