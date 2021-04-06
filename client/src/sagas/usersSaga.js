import { takeEvery, fork, call, put, select } from "redux-saga/effects";
import * as types from "../actions/action_types/users";
import * as api from "../api/users";
import * as helper from "../helpers/utils";
const auth = (state) => state.auth;

const sess_id = (state) => state.auth.sess._id;

function* getAllUsers(action) {
  // try to make the api call
  let user_id = yield select(sess_id);
  try {
    // yield the api responsse into data
    const data = yield call(api.getAllUsers, user_id);
    yield put({
      type: types.GET_USERS_SUCCESS,
      payload: data.data,
    });
  } catch (e) {
    console.log(e);
  }
}
function* getUserMeta(action) {
  try {
    const response = yield call(api.getUserMeta, action.payload);

    yield put({
      type: types.GET_USERMETA_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    yield put({
      type: types.GET_USERMETA_FAIL,
      payload: {
        error: err?.response?.data.message || err.message,
      },
    });
  }
}
function* getProfile(action) {
  try {
    const authState = yield select(auth);
    const response = yield call(
      api.getUserProfile,
      authState.sess._id,
      action.payload
    );

    yield put({
      type: types.GET_PROFILE_SUCCESS,
      payload: response.data.user,
    });
  } catch (err) {
    yield put({
      type: types.GET_PROFILE_FAIL,
      payload: {
        error: err?.response?.data.message || err.message,
      },
    });
  }
}
function* watchGetAllUsers() {
  // create watcher of fetchData function
  yield takeEvery(types.GET_USERS_LOADING, getAllUsers);
}
function* watchGetUserMeta() {
  // create watcher of fetchData function
  yield takeEvery(types.GET_USERMETA_LOADING, getUserMeta);
}
function* watchGetProfile() {
  // create watcher of fetchData function
  yield takeEvery(types.GET_PROFILE_LOADING, getProfile);
}
const usersSaga = [
  fork(watchGetAllUsers),
  fork(watchGetUserMeta),
  fork(watchGetProfile),
];

export default usersSaga;
