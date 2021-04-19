import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/inbox';
import * as api from '../api/inbox';

const sess_id = (state) => state.auth.sess._id;
function* loadMyInbox(action) {
  // try to make the api call
  const user_id = yield select(sess_id);
  try {
    // yield the api responsse into data
    const response = yield call(api.loadInbox, user_id);
    yield put({
      type: types.MY_INBOX_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    console.log(e);
  }
}
function* watchLoadInbox() {
  // create watcher of fetchData function
  yield takeEvery(types.MY_INBOX_LOADING, loadMyInbox);
}
const eventSaga = [fork(watchLoadInbox)];

export default eventSaga;
