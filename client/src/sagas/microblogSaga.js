import { takeEvery, fork, call, put, select } from "redux-saga/effects";
import * as types from "../actions/action_types/microblog";
import * as api from "../api/microblog";

// const sess_id = (state) => state.auth.sess._id;

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
function* watchGetAllMicroBlogs() {
  // create watcher of fetchData function
  yield takeEvery(types.GET_MICROBLOGS_LOADING, getAllMicroBlogs);
}
const microblogSaga = [fork(watchGetAllMicroBlogs)];

export default microblogSaga;
