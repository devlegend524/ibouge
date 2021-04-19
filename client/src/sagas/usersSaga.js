import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/users';
import {FRIEND_REQUEST} from '../actions/action_types/notification';
import * as api from '../api/users';
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
function* getFriends(action) {
  try {
    const response = yield call(api.getMyFriends, action.payload);

    yield put({
      type: types.GET_FRIENDS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    yield put({
      type: types.GET_FRIENDS_SUCCESS,
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
function* sendFriendRequest(action) {
  try {
    const authState = yield select(auth);
    const response = yield call(
      api.sendFriendRequest,
      authState.sess._id,
      action.payload
    );
    console.log('sent friend request:', response);
    yield put({
      type: FRIEND_REQUEST,
      payload: 1,
    });
  } catch (err) {
    console.log(err);
  }
}
function* acceptFriendRequest(action) {
  try {
    const authState = yield select(auth);
    const response = yield call(
      api.acceptFriendRequest,
      authState.sess._id,
      action.payload
    );
    console.log('sent friend request:', response);
    yield put({
      type: FRIEND_REQUEST,
      payload: 1,
    });
  } catch (err) {
    console.log(err);
  }
}
function* unfriend(action) {
  try {
    const authState = yield select(auth);
    const response = yield call(
      api.unfriend,
      authState.sess._id,
      action.payload
    );
    console.log('sent friend request:', response);
    yield put({
      type: FRIEND_REQUEST,
      payload: 1,
    });
  } catch (err) {
    console.log(err);
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
function* watchSendFriendRequest() {
  // create watcher of fetchData function
  yield takeEvery(types.SEND_FRIEND_REQUEST, sendFriendRequest);
}
function* watchAcceptFriendRequest() {
  // create watcher of fetchData function
  yield takeEvery(types.ACCEPT_FRIEND_REQUEST, acceptFriendRequest);
}
function* watchUnfriendRequest() {
  // create watcher of fetchData function
  yield takeEvery(types.CANCEL_FRIEND_REQUEST, unfriend);
}
const usersSaga = [
  fork(watchGetAllUsers),
  fork(watchGetUserMeta),
  fork(watchGetProfile),
  fork(watchSendFriendRequest),
  fork(watchAcceptFriendRequest),
  fork(watchUnfriendRequest),
];

export default usersSaga;
