import {takeEvery, fork, call, put, select} from 'redux-saga/effects';
import * as types from '../actions/action_types/event';
import * as api from '../api/event';

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
function* createEvent(action) {
  // try to make the api call
  try {
    console.log('===create event-====', action.payload.data);

    // yield the api responsse into data
    const data = yield call(
      api.createEvent,
      action.payload.file,
      action.payload.data
    );
    yield put({
      type: types.CREATE_EVENTS_SUCCESS,
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
function* watchCreateEvents() {
  // create watcher of fetchData function
  yield takeEvery(types.CREATE_EVENTS_LOADING, createEvent);
}
const eventSaga = [fork(watchGetAllEvents), fork(watchCreateEvents)];

export default eventSaga;
