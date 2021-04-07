import {all, fork, take, call, put, cancel} from 'redux-saga/effects';

import commonSaga from './commonSaga';
import authSaga from './authSaga';
import registerSaga from './registerSaga';
import usersSaga from './usersSaga';
import eventSaga from './eventSaga';
import microblogSaga from './microblogSaga';
import socketSaga from './socketSaga';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    ...socketSaga,
    ...commonSaga,
    ...authSaga,
    ...registerSaga,
    ...usersSaga,
    ...eventSaga,
    ...microblogSaga,
  ]);
}
