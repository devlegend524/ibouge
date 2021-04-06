import { takeEvery, fork, call,  put, select } from 'redux-saga/effects';
import * as types from '../actions/types';

const commonSaga = [
    // fork(watchSetPageTitle)
];

export default commonSaga;