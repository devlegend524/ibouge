import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/feed';
import * as api from '../api/feed';
import io from 'socket.io-client';
import {socketUrl} from '../constants';
const socket = io.connect(socketUrl);
const sess = (state) => state.auth.sess;
function* postNewStatus(action) {
  // try to make the api call
  const user = yield select(sess);
  console.log('new_post_data', action.payload);
  try {
    // yield the api responsse into data
    const response = yield call(api.postNewFeed, action.payload.data);
    yield put({
      type: types.POST_NEW_DATA_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    console.log(e);
  }
}
function* getAllStatus(action) {
  try {
    const response = yield call(api.getAllStatus);
    yield put({
      type: types.GET_ALL_STATUS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.log(err);
  }
}
function* deleteStatus(action) {
  console.log('=======deleteStatus======', action.payload);
  try {
    const response = yield call(
      api.deleteStatus,
      action.payload.id,
      action.payload.from
    );
    yield put({
      type: types.DELETE_STATUS_SUCCESS,
      payload: action.payload,
    });
  } catch (err) {
    console.log(err);
  }
}
function* watchPostNewStatus() {
  yield takeEvery(types.POST_NEW_DATA_LOADING, postNewStatus);
}
function* watchGetAllStatus() {
  yield takeEvery(types.GET_ALL_STATUS_LOADING, getAllStatus);
}
function* watchDeleteStatus() {
  yield takeEvery(types.DELETE_STATUS_LOADING, deleteStatus);
}

const feedSaga = [
  fork(watchPostNewStatus),
  fork(watchGetAllStatus),
  fork(watchDeleteStatus),
];

export default feedSaga;
