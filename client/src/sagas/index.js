import io from "socket.io-client";
import { eventChannel } from "redux-saga";
import { all, fork, take, call, put, cancel } from "redux-saga/effects";

import {
  login,
  logout,
  addUser,
  removeUser,
  newMessage,
  sendMessage,
} from "../actions/socket";

import commonSaga from "./commonSaga";
import authSaga from "./authSaga";
import registerSaga from "./registerSaga";
import usersSaga from "./usersSaga";
import eventSaga from "./eventSaga";
import microblogSaga from "./microblogSaga";

function connect() {
  let ioHost = "https://www.ibouge.com";
  if (
    document.location.hostname == "localhost" ||
    document.location.hostname == "127.0.0.1"
  ) {
    ioHost = "http://" + document.location.hostname + ":8080";
  }
  const socket = io(ioHost);
  return new Promise((resolve) => {
    socket.on("connect", () => {
      console.log("======  socket connected ======");
      resolve(socket);
    });
  });
}

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on("users.login", ({ username }) => {
      emit(addUser({ username }));
    });
    socket.on("users.logout", ({ username }) => {
      emit(removeUser({ username }));
    });
    socket.on("messages.new", ({ message }) => {
      emit(newMessage({ message }));
    });
    socket.on("disconnect", (e) => {
      // TODO: handle
    });
    return () => {};
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* write(socket) {
  while (true) {
    const { payload } = yield take(`${sendMessage}`);
    socket.emit("message", payload);
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(write, socket);
}

function* flow() {
  while (true) {
    let { payload } = yield take(`${login}`);
    const socket = yield call(connect);
    socket.emit("login", { username: payload.username });

    const task = yield fork(handleIO, socket);

    let action = yield take(`${logout}`);
    yield cancel(task);
    socket.emit("logout");
  }
}
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    fork(flow),
    ...commonSaga,
    ...authSaga,
    ...registerSaga,
    ...usersSaga,
    ...eventSaga,
    ...microblogSaga,
  ]);
}
