import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/notification';
import * as api from '../api/notification';

const sess_id = (state) => state.auth.sess._id;
function* loadNotifications(action) {
  // try to make the api call
  const user_id = yield select(sess_id);
  try {
    // yield the api responsse into data
    const response = yield call(api.loadNotification, user_id);
    yield put({
      type: types.NOTIFICATION_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    console.log(e);
  }
}
function* watchLoadNotifications() {
  // create watcher of fetchData function
  yield takeEvery(types.NOTIFICATION_LOADING, loadNotifications);
}
const eventSaga = [fork(watchLoadNotifications)];

export default eventSaga;
