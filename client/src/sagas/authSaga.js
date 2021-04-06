import { takeEvery, fork, call, put, select } from "redux-saga/effects";
import * as types from "../actions/action_types/auth";
import { deleteAllCookies } from "../helpers/utils";
import {
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUCCESS,
  NEW_PASSWORD_LOADING,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAILED,
} from "../actions/action_types/restorepassword";
import * as api from "../api/auth";
import * as helper from "../helpers/utils";
const auth = (state) => state.auth;

function* loadMe() {
  const authState = yield select(auth);
  const options = helper.attachTokenToHeaders(authState);
  try {
    const response = yield call(api.loadMe, options);
    yield put({
      type: types.ME_SUCCESS,
      payload: { user: response.data },
    });
  } catch (err) {
    yield put({
      type: types.ME_FAIL,
    });
  }
}

function* loginUserWithEmail(action) {
  // try to make the api call
  // let prop_id = yield select(proposer_id)
  try {
    // yield the api responsse into data
    const response = yield call(api.loginUserWithEmail, action.payload);
    if (response.data.state === "success") {
      yield put({
        type: types.LOGIN_WITH_EMAIL_SUCCESS,
        payload: { user: response.data.user },
      });
      sessionStorage.setItem("current_user", response.data.user.email);
      yield put(loadMe());
    } else if (response.data.state === "failure") {
      yield put({
        type: types.LOGIN_WITH_EMAIL_FAIL,
        payload: response.data.message,
      });
    }
  } catch (e) {}
}

function* logInUserWithOauth(action) {
  // try to make the api call
  // let prop_id = yield select(proposer_id)
  try {
    // yield the api responsse into data
    const response = yield call(api.loginUserWithEmail, action.payload);
    if (response.data.state === "success") {
      yield put({
        type: types.LOGIN_WITH_EMAIL_SUCCESS,
        payload: { user: response.data.user },
      });
      sessionStorage.setItem("current_user", response.data.user.email);
      yield put(loadMe());
    } else if (response.data.state === "failure") {
      yield put({
        type: types.LOGIN_WITH_EMAIL_FAIL,
        payload: response.data.message,
      });
    }
  } catch (e) {
    yield put({
      type: types.LOGIN_WITH_EMAIL_FAIL,
      payload: "please try again",
    });
  }
}
function* restorePassword(action) {
  // let prop_id = yield select(proposer_id)
  try {
    // yield the api responsse into data
    const response = yield call(api.restorePassword, action.payload);
    if (response.data.state === "success") {
      yield put({
        type: RESET_PASSWORD_SUCCESS,
        payload: response.data.message,
      });
    } else if (response.data.state === "error") {
      yield put({
        type: RESET_PASSWORD_FAILED,
        payload: response.data.message,
      });
    }
  } catch (e) {
    yield put({
      type: RESET_PASSWORD_FAILED,
      payload: "please try again",
    });
  }
}
function* newPassword(action) {
  // let prop_id = yield select(proposer_id)
  try {
    // yield the api responsse into data
    const response = yield call(api.createNewPassword, action.payload);
    if (response.data.state === "success") {
      yield put({
        type: NEW_PASSWORD_SUCCESS,
        payload: response.data.message,
      });
    } else if (response.data.state === "error") {
      yield put({
        type: NEW_PASSWORD_FAILED,
        payload: response.data.message,
      });
    }
  } catch (e) {
    yield put({
      type: NEW_PASSWORD_FAILED,
      payload: "please try again",
    });
  }
}
function* activeUser(action) {
  try {
    // yield the api responsse into data
    const response = yield call(api.activeUser, action.payload);
    if (response.data.state === "success") {
      yield put({
        type: types.LOGIN_WITH_EMAIL_SUCCESS,
        payload: { user: response.data.user },
      });
      sessionStorage.setItem("current_user", response.data.user.email);
      yield put(loadMe());
    } else if (response.data.state === "failure") {
      yield put({
        type: types.LOGIN_WITH_EMAIL_FAIL,
        payload: response.data.message,
      });
    }
  } catch (e) {
    yield put({
      type: types.LOGIN_WITH_EMAIL_FAIL,
      payload: "User Activation failed. Please try again",
    });
  }
}
function* logOutUser(action) {
  try {
    deleteAllCookies();
    // yield the api responsse into data
    yield call(api.logOutUser);
    yield put({
      type: types.LOGOUT_SUCCESS,
      payload: "User Logged Out!",
    });
  } catch (e) {}
}
function* watchLoadMe() {
  // create watcher of fetchData function
  yield takeEvery(types.ME_LOADING, loadMe);
}
function* watchLoginWithEmail() {
  // create watcher of fetchData function
  yield takeEvery(types.LOGIN_WITH_EMAIL_LOADING, loginUserWithEmail);
}
function* watchLoginWithOAuth() {
  // create watcher of fetchData function
  yield takeEvery(types.LOGIN_WITH_OAUTH_LOADING, logInUserWithOauth);
}
function* watchRestorePassword() {
  // create watcher of fetchData function
  yield takeEvery(RESET_PASSWORD_LOADING, restorePassword);
}
function* watchNewPassword() {
  // create watcher of fetchData function
  yield takeEvery(NEW_PASSWORD_LOADING, newPassword);
}
function* watchActiveUser() {
  // create watcher of fetchData function
  yield takeEvery(types.ACTIVATE_USER_LOADING, activeUser);
}
function* watchlogOutUser() {
  // create watcher of fetchData function
  yield takeEvery(types.LOGOUT_LOADING, logOutUser);
}
const authSaga = [
  fork(watchLoadMe),
  fork(watchLoginWithEmail),
  fork(watchLoginWithOAuth),
  fork(watchRestorePassword),
  fork(watchNewPassword),
  fork(watchActiveUser),
  fork(watchlogOutUser),
];

export default authSaga;
