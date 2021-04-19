import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Picker} from 'emoji-mart';
import {Smile} from 'react-feather';

import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';
import {loadChatHistory} from '../../api/chat';
import {generateRoomName, linkify} from '../../helpers/chat';
import {closeCurrentChat} from '../../actions/chatAction';
import {getUserProfile} from '../../api/users';

import 'emoji-mart/css/emoji-mart.css';

import './styles.scss';

import noImageAvailable from '../../assets/img/noImageAvailable.jpg';

const Chatroom = () => {
  const auth = useSelector((state) => state.auth);
  const chatStore = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [chatMessage, setChatMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChat, setShowChat] = useState(chatStore?.ctrl.show);
  const [chats, setChats] = useState(chatStore);
  const [typing, setTyping] = useState({
    typing: false,
    user: [],
  });

  const [socket] = useSocket(socketUrl);
  socket.connect();
  useEffect(() => {
    setChats(chatStore);
    setShowChat(chatStore.ctrl.show);
  }, [chatStore]);

  useEffect(() => {
    socket.on('message', function (data) {
      // scope.typing = false;
      console.log('recieved message', data);
      showMessageInChat(data);
      // $rootScope.$broadcast('message', {typeOfChat: 'personToPerson'});
    });

    socket.on(
      'typing',
      function (data) {
        setTyping({
          typing: true,
          user: data,
        });
        setTimeout(function () {
          // scope.typing = false;
          setTyping({
            typing: false,
            user: [],
          });
        }, 3000);
      },
      0
    );

    socket.on('loadP2PChatHistory', function (data) {
      const chat = getChat('room', data.room);
      if (chat) {
        loadChatHistory(chat)
          .then((res) => {
            console.log(res);
          })
          .catch((e) => console.log(e));
      }
    });
  }, []);

  const showMessageInChat = (data) => {
    console.log('===show message in chat ===', data);
    // const chat = getChat('room', data.room);
    const chat = chats.chats.filter((chat) => chat.room === data.room);
    if (chat) {
      // chat exists
      const temp = chats;
      temp.chats.map((chat) => {
        if (chat.room === data.room) {
          chat.messages.push({
            in: true,
            from: data.from,
            time: data.time,
            msg: data.msg,
            id: data._id,
          });
          chat.offset++;
        }
      });
      // temp.chats.messages.push({
      //   in: true,
      //   from: data.from,
      //   time: data.time,
      //   msg: data.msg,
      //   id: data._id,
      // });
      // temp.chats.offset++;
      setChats(temp);
    } else {
      const temp = chats;

      temp.chats.messages.push({
        in: true,
        from: data.from,
        time: data.time,
        msg: data.msg,
        id: data._id,
      });
      temp.chats.offset++;
      setChats(temp);
    }
  };
  const getChat = (key, value) => {
    for (let i = 0; i < chats.length; i++) {
      if (chats[i][key] === value) {
        return chats[i];
      }
    }
    return null;
  };

  const sendMsgOnEnter = (event, msg, chat) => {
    if (event.which === 13) {
      msg = document.querySelector('#hidden-chat-' + chat.room).value;
      document.querySelector('#hidden-chat-' + chat.room).value = '';
      sendMessage(msg, chat);
    } else {
      const me = auth.sess._id;
      socket.emit('typing', {
        room: chat.room,
        from: auth.sess,
        to: chat.friends._id,
        msg: msg,
        time: Date.now(),
      });
      document.querySelector('#hidden-chat-' + chat.room).value =
        event.target.value;
    }
  };
  const sendMessage = (msg, chat) => {
    if (!msg || msg.trim() === '') {
      return;
    }
    const index = chats.chats.indexOf(chat);
    msg = msg.trim();
    chat.chatMessage = null;
    if (socket) {
      const me = auth.sess._id;
      if (chat.isGroupChat) {
        socket.emit('group-message', {room: chat.room, from: me, msg: msg});
      } else {
        socket.emit('message', {
          room: chat.room,
          from: me,
          to: chat.friends._id,
          msg: msg,
          time: Date.now(),
        });
      }
      const temp = chats;
      temp.chats[index].messages.push({
        in: false,
        from: me,
        time: Date.now(),
        msg: msg,
      });
      temp.chats[index].offset++;
      setChats(temp);
    }
    setChatMessage('');
  };
  const openChat = (users, room) => {
    let chat = null;
    if (!room) {
      chat = createRoom(users);
    } else if (room) {
      chat = createRoom(users, room);
    }
    if (chat) {
      // join the socket.io room
      // when the chat is opened
      socket.emit('join-room', {
        room: chat.room,
      });

      socket.emit('open-chat', {
        id: chat.me._id,
        room: chat.room,
        isGroupChat: false,
      });
    }
  };

  const createRoom = (friends, room) => {
    let isGroupChat = false;
    if (room) {
      isGroupChat = true;
    } else {
      room = generateRoomName(auth.sess._id, friends._id);
    }
    if (!getChat('room', room)) {
      const chat = {
        isGroupChat: isGroupChat,
        me: auth.sess,
        friends: friends,
        room: room,
        limit: 20,
        offset: 0,
        messages: [],
      };
      const temp = chats;
      temp.chats.push(chat);
      setChats(temp);
      return chat;
    }
    return null;
  };

  const closeChat = (chat) => {
    dispatch(closeCurrentChat(chat));
    const index = chats.chats.indexOf(chat);
    if (index > -1) {
      // leave the chat room
      // when the chat is x'd
      // off the screen
      socket.emit('leave-room', {
        room: chat.room,
      });

      socket.emit('close-chat', {id: chat.me._id, room: chat.room});
      const temp = chats.chats;
      temp.splice(index, 1);
      console.log('======', index, temp);

      setChats({
        ...chats,
        chats: temp,
      });
    }
  };
  const getFromImage = (from, chat) => {
    for (let i = 0; i < chat.friends.length; i++) {
      if (chat.friends[i].user_id === from) {
        // return UserService.getProfilePic(chat.friends[i].profile_pic);
      }
    }
    return '';
  };
  // Import AddEmoji
  const addEmoji = (e, chat) => {
    let sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach((el) => codesArray.push('0x' + el));
    let emoji = String.fromCodePoint(...codesArray);
    setChatMessage(chatMessage + emoji);
    document.querySelector('#hidden-chat-' + chat.room).value = chatMessage;
  };
  const toogleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  // const closeChat = () => {
  //   // props.handleClick(false);
  //   setOpenChat(false);
  // };

  // React.useEffect(() => {
  //   setOpenChat(props.open);
  // }, [props]);
  return (
    <>
      {showChat && (
        <div
          className="ibg-chat-window-wpr"
          style={{display: 'flex', zIndex: '10000'}}
        >
          {chats &&
            chats.chats.map((chat, uniqueId) => (
              <div className="popper-content ibg-chat-wpr" key={uniqueId}>
                <div className="popover-topnav-head">
                  <div className="pop-purple-head">
                    <span>
                      {chat.isGroupChat
                        ? 'Group Chat'
                        : chat.friends.fname + ' ' + chat.friends.lname}
                    </span>
                    <i
                      className={`fa fa-circle float-pop-${
                        chat.friends.is_online ? 'online' : 'idle'
                      }`}
                      aria-hidden="true"
                    ></i>
                    <div
                      className="dropdown float-pop-morebtn"
                      style={{textAlign: 'right'}}
                    >
                      <i
                        className="fa fa-close"
                        aria-hidden="true"
                        style={{cursor: 'pointer'}}
                        onClick={(e) => closeChat(chat)}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="popover-topnav-subheading">
                  <div
                    className="chat-wrap-pop"
                    style={{
                      float: 'left',
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}
                  >
                    {chat.messages &&
                      chat.messages.map((message, index) => (
                        <div
                          className="col-md-12 col-sm-12 col-12 colPadZero"
                          key={index}
                        >
                          {message.in ? (
                            <div className="chat-bubble-wrap" ng-if="">
                              <img
                                ng-if="chat.isGroupChat"
                                ng-init="message.widthStyle={'max-width':'82%'}"
                                src={
                                  getFromImage(message.from, chat)
                                    ? getFromImage(message.from, chat)
                                    : noImageAvailable
                                }
                                className="chatImg"
                                alt="chatImg"
                              />
                              <div className="chatBubble">{message.msg}</div>
                            </div>
                          ) : (
                            <div className="chat-bubble-wrap" ng-if="!">
                              <div className="arrow-right"></div>
                              <div className="chat-sent-bubble">
                                {message.msg}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    {typing.typing && (
                      <div className="chat-in-time">
                        <div className="ticontainer">
                          <span>
                            {typing.user?.from?.fname}{' '}
                            {typing.user?.from?.lname} is typing...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="chat-reply-area w-300">
                    <div className="col-md-12 col-sm-12 col-12 colPadZero chat-btn-seperate">
                      <div className="col-md-2 col-sm-2 col-12">
                        <span>
                          {showEmojiPicker ? (
                            <Picker
                              onSelect={(e) => addEmoji(e, addEmoji)}
                              style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                              }}
                            />
                          ) : null}
                        </span>
                        <button
                          type="button"
                          className="toggle-emoji"
                          onClick={toogleEmojiPicker}
                        >
                          <Smile />
                        </button>
                      </div>
                      <div className="col-md-8 col-sm-8 col-8 colPadZero">
                        <div className="chat-reply-txt single-chat-reply-txt">
                          <input
                            type="hidden"
                            name="status"
                            id={`hidden-chat-${chat.room}`}
                          />
                          <input
                            type="text"
                            onKeyDown={(e) =>
                              sendMsgOnEnter(e, chatMessage, chat)
                            }
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="chat-reply-form"
                            placeholder="Type your message"
                            id="chat-{{chat.room}}"
                          />
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-2 col-2 colPadZero">
                        <button
                          type="button"
                          onClick={(e) => sendMessage(chatMessage, chat)}
                          className="btn btn-primary chat-pop-send-btn margin-btn"
                        >
                          <i
                            className="fa fa-paper-plane"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Chatroom;
