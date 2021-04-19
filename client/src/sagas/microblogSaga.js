import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/microblog';
import * as api from '../api/microblog';

const sess_id = (state) => state.auth.sess._id;

function* getAllMicroBlogs(action) {
  // try to make the api call
  // let user_id = yield select(user_id);
  try {
    // yield the api responsse into data
    const data = yield call(api.getAllMicroblogs);
    yield put({
      type: types.GET_MICROBLOGS_SUCCESS,
      payload: data.data,
    });
  } catch (e) {
    console.log(e);
  }
}
function* createMicroBlog(action) {
  // try to make the api call
  let user_id = yield select(sess_id);
  try {
    // yield the api responsse into data
    const response = yield call(api.createMicroblog, user_id, action.payload);
    console.log('====microblog created====', response);
    yield put({
      type: types.CREATE_MICROBLOG_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    console.log(e);
  }
}

function* watchGetAllMicroBlogs() {
  // create watcher of fetchData function
  yield takeEvery(types.GET_MICROBLOGS_LOADING, getAllMicroBlogs);
}

function* watchCreateMicroBlog() {
  // create watcher of fetchData function
  yield takeEvery(types.CREATE_MICROBLOG_LOADING, createMicroBlog);
}

const microblogSaga = [fork(watchGetAllMicroBlogs), fork(watchCreateMicroBlog)];

export default microblogSaga;
