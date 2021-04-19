import {all} from 'redux-saga/effects';

import commonSaga from './commonSaga';
import authSaga from './authSaga';
import registerSaga from './registerSaga';
import usersSaga from './usersSaga';
import eventSaga from './eventSaga';
import microblogSaga from './microblogSaga';
import feedSaga from './feedSaga';
import inboxSaga from './inboxSaga';
import notificationSaga from './notificationSaga';
import chatSaga from './chatSaga';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    ...feedSaga,
    ...commonSaga,
    ...chatSaga,
    ...authSaga,
    ...registerSaga,
    ...usersSaga,
    ...eventSaga,
    ...microblogSaga,
    ...inboxSaga,
    ...notificationSaga,
  ]);
}
