import axios from "axios";

import { attachTokenToHeaders } from "../helpers/utils";
import {
  GET_PROFILE_LOADING,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  EDIT_USER_LOADING,
  USER_PROFILE_CHANGE,
  EDIT_USER_FAIL,
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  GET_USERMETA_LOADING,
  GET_USERMETA_SUCCESS,
  GET_USERMETA_FAIL,
  GET_USERS_LOADING,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
} from "./action_types/users";

import { logOutUser, loadMe } from "./authActions";
export const getAllUsers = () => ({ type: GET_USERS_LOADING });

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
    history.push("/users");
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
export const getUserMeta = (userId) => ({
  type: GET_USERMETA_LOADING,
  payload: userId,
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
