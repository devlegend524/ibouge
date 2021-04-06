import { takeEvery, fork, call, put, select } from "redux-saga/effects";
import * as types from "../actions/action_types/event";
import * as api from "../api/event";

// const sess_id = (state) => state.auth.sess._id;
function* getAllEvents(action) {
  // try to make the api call
  try {
    // yield the api responsse into data
    const data = yield call(api.getAllEvents);
    yield put({
      type: types.GET_EVENTS_SUCCESS,
      payload: data.data,
    });
  } catch (e) {
    console.log(e);
  }
}
function* watchGetAllEvents() {
  // create watcher of fetchData function
  yield takeEvery(types.GET_EVENTS_LOADING, getAllEvents);
}
const eventSaga = [fork(watchGetAllEvents)];

export default eventSaga;
