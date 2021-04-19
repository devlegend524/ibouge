import React, {createContext} from 'react';
import io from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import {addEventLike} from './actions/eventAction';
import {socketUrl} from './constants';
import {
  sendFriendRequest,
  acceptFriendRequest,
  unfriend,
} from './actions/userActions';
import * as Feed from './actions/feedActions';
const WebSocketContext = createContext(null);

export {WebSocketContext};

const WebSocketProvider = ({children}) => {
  let socket;
  let ws;
  const auth = useSelector((state) => state.auth.sess);
  const myEvents = useSelector((state) => state.events.events);
  const allStatusUpdates = useSelector((state) => state.feed.statuses);
  const dispatch = useDispatch();

  // const sendMessage = (roomId, message) => {
  //   const payload = {
  //     roomId: roomId,
  //     data: message,
  //   };
  //   socket.emit('event://send-message', JSON.stringify(payload));
  //   // dispatch(updateChatLog(payload));
  // };
  const friendRequest = (from, to, type) => {
    if (type === 'unfriend') dispatch(acceptFriendRequest(to));
    if (type === 'addAsFriend') dispatch(unfriend(to));
    if (type === 'acceptFriendRequest') dispatch(sendFriendRequest(to));

    socket.emit('new-notification', {
      from: from,
      to: to,
      type: type,
    });
  };
  const _addEventLike = (data) => {
    socket.emit('add-event-like', data);
  };
  const _RemoveEventLike = (data) => {
    socket.emit('remove-event-like', data);
  };
  const _removeStatusLike = (data) => {
    // but database also needs to be updated, here
    socket.emit('remove-status-like', data);
  };
  const _addStatusLike = (data) => {
    socket.emit('add-status-like', data);
  };
  const _addReply = (data) => {
    socket.emit('add-reply', data);
  };
  if (!socket) {
    socket = io.connect(socketUrl, {resource: 'http://localhost:5000'});
    console.log(socket.connected);
    let interval = setInterval(function () {
      if (auth) {
        socket.emit('addUserID', {
          id: auth._id,
        });
        clearInterval(interval);
      }
    }, 3000);

    // socket.on('newNotification', function (data) {
    //   if (!data) {
    //     $rootScope.$broadcast('new-notification');
    //   } else {
    //     $rootScope.$broadcast('new-notification', {type: data.type});
    //   }
    // });

    // socket.on('presence', function (data) {
    //   $rootScope.$broadcast('presence', data);
    // });

    socket.on('newNotification', function (data) {
      if (data.type) {
        switch (data.type) {
          case 'addAsFriend':
            sendFriendRequest(data);
            break;
          case 'unfriend':
            unfriend(data);
            break;
          case 'acceptFriendRequest':
            acceptFriendRequest(data);
            break;
          default:
            unfriend(data);
            break;
        }
      }
    });
    ws = {
      socket: socket,
      friendRequest,
      _addEventLike,
      _RemoveEventLike,
      _removeStatusLike,
      _addStatusLike,
      _addReply,
    };
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
export default WebSocketProvider;
