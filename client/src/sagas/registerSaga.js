import { takeEvery, fork, call, select, put } from "redux-saga/effects";
import * as types from "../actions/action_types/auth";
import * as api from "../api/register";
import * as userAPI from "../api/users";

const userEmail = (state) => state.auth.current_user;

function* registerWithEmail(action) {
  try {
    const response = yield call(api.registerUserWithEmail, action.payload);

    yield put({
      type: types.REGISTER_WITH_EMAIL_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    yield put({
      type: types.REGISTER_WITH_EMAIL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}
function* registerResendEmail(action) {
  console.log(action.payload);
  try {
    const response = yield call(api.registerResendEmail, action.payload);

    yield put({
      type: types.REGISTER_RESEND_EMAIL_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    yield put({
      type: types.REGISTER_RESEND_EMAIL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}
function* updateUser(action) {
  const user_email = yield select(userEmail);
  console.log("updateUser payload=========", action.payload);
  try {
    const response = yield call(userAPI.updateUser, user_email, action.payload);
    console.log("updateUser response=========", response);
    yield put({
      type: types.SET_PROFILE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.log("updateUser error=========", err);

    yield put({
      type: types.SET_PROFILE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}
function* watchRegisterWithEmail() {
  // create watcher of fetchData function
  yield takeEvery(types.REGISTER_WITH_EMAIL_LOADING, registerWithEmail);
}
function* watchRegisterResendEmail() {
  // create watcher of fetchData function
  yield takeEvery(types.REGISTER_RESEND_EMAIL_LOADING, registerResendEmail);
}
function* watchUpdateProfile() {
  // create watcher of fetchData function
  yield takeEvery(types.SET_PROFILE_LOADING, updateUser);
}
const registerSaga = [
  fork(watchRegisterWithEmail),
  fork(watchRegisterResendEmail),
  fork(watchUpdateProfile),
];

export default registerSaga;
