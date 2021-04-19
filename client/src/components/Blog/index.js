import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Add_User from '../../assets/img/add_user.png';
import Modal from '@material-ui/core/Modal';
import * as UserAPI from '../../api/users';
import * as MicroblogAPI from '../../api/microblog';
import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';
import {newNotification} from '../../actions/notificationAction';
import uploadPhoto from '../../assets/img/upload-photo.png';
import './styles.scss';

const Blog = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [socket] = useSocket(socketUrl);
  socket.connect();
  const [currentMicroblog, setCurrentMicroBlog] = useState({
    ...props.data,
    me: auth.sess,
  });
  const [microblogs, setMicroBlogs] = useState([currentMicroblog]);
  const [microblogUsers, setMicroblogUsers] = useState(currentMicroblog?.users);
  const [moreUsers] = useState(microblogUsers?.length - 6);
  const [bookmarkClicked, setBookMarkClicked] = useState(false);
  const [microblogMessage, setMicroblogMessage] = useState('');
  const [myFriends, setMyFriends] = useState({
    show: false,
    friends: [],
  });
  const [friendsToInvite, setFriendToInvite] = useState([]);
  const [allInvolved] = useState([]);
  const [newUserMeta, setNewUserMeta] = useState({});
  const [File, setFile] = useState({});
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [imageInfo, setImageInfo] = useState({});
  useEffect(() => {
    loadMyFriends();
    openMicroblog(props.data.users, props.data.room, props.data.name);

    socket.on('new-notification-to-show', (event) => {
      dispatch(newNotification(true));
    });
    return () => {
      closeWindow(currentMicroblog);
    };
  }, []);
  const loadMicroblogHistoryFunction = (data) => {
    const microblog = getMicroblog('room', data.room);
    if (microblog) {
      const micro = loadMicroblogHistory(microblog);
      if (micro) {
        scrollToBottomOfMicroblog(microblog.room);
      }
    }
  };

  const handleMicroblogMessage = (data) => {
    showMessageInMicroblog(data);
  };

  const microblogImageMessage = (data) => {
    showImageMessage(data);
  };

  const newMicroblogUser = (data) => {
    showNewUserInMicroblog(data);
  };
  // function to decide which of the clients friends
  // go on the right side of the microblog when the add
  // a friend button is clicked
  const loadMyFriends = () => {
    // get all of the users friends
    UserAPI.getMyFriends()
      .then((friends) => {
        // put those friends into the below empty array
        setMyFriends({
          ...myFriends,
          friends: [...friends.data],
        });

        const myFriendsLength = myFriends.length;

        // iterate through each of the clients friends
        for (let i = 0; i < myFriendsLength; i++) {
          // search the microblog users
          microblogUsers.find((microblogUser) => {
            // if the current microblogUsers id matches the
            // current friends id
            if (myFriends.friends[i]._id === microblogUser.user_id) {
              // search through the $scopes friends
              myFriends.friends.find((friend, index) => {
                // if the microblog user and friends id match
                if (microblogUser.user_id === friend._id) {
                  // remove that friends from the myFriends.friends
                  const temp = myFriends.friends.splice(index, 1);
                  setMyFriends({
                    ...myFriends,
                    friends: [...temp],
                  });
                  return true;
                }
              });
            }
          });
        }
      })
      .catch((err) => console.log('friends load err:', err));
  };

  const showMyFriends = () => {
    if (myFriends.show === false) {
      myFriends.show = true;
    } else {
      myFriends.show = false;
    }
  };

  const selectFriend = (friendId) => {
    const secondElement = document.querySelector('friendImg' + friendId);
    if (secondElement.classList.contains('faded')) {
      secondElement.classList.remove('faded');
      for (let j = 0; j < friendsToInvite.length; j++) {
        if (friendsToInvite[j]._id === friendId) {
          const index = friendsToInvite.indexOf(friendsToInvite[j]);
          const temp = friendsToInvite.splice(index, 1);
          setFriendToInvite([...temp]);
        }
        if (friendsToInvite.length === 0) {
          setFriendToInvite([]);
        }
      }
    } else {
      secondElement.classList.add('faded');
      for (let i = 0; i < myFriends.friends.length; i++) {
        if (myFriends.friends[i]._id === friendId) {
          myFriends.friends[i].selected = true;
          const temp = friendsToInvite.push(myFriends.friends[i]);
          setFriendToInvite([...temp]);
        }
      }
    }
  };

  const inviteFriends = () => {
    const friendsIdToInvite = [];
    for (let i = 0; i < friendsToInvite.length; i++) {
      friendsIdToInvite.push(friendsToInvite[i]._id);
    }

    const data = {
      microblog: currentMicroblog,
      friends: friendsIdToInvite,
    };
    MicroblogAPI.addMicroblogNotification(data);
    for (var j = 0; j < friendsIdToInvite.length; j++) {
      socket.emit('new-notification', {
        from: auth.sess._id,
        to: friendsIdToInvite[j],
        type: 'invite-to-microblog',
      });
    }

    const inviteInfo = {
      room: props.data.room,
      users: friendsIdToInvite,
    };
    socket.emit('update-all-involved-array', inviteInfo);
    setMyFriends({
      ...myFriends,
      show: false,
    });
  };

  const getMicroblog = (key, value) => {
    let total = 0;
    console.log('intial microblogs==value', microblogs);

    for (let i = 0; i < microblogs.length; i++) {
      console.log('Key==value', microblogs[i][key], value);
      if (microblogs[i][key] === value) {
        return microblogs[i];
      } else {
        total++;
      }
    }
    if (total === microblogs.length) {
      return null;
    }
  };

  const showMessageInMicroblog = (data) => {
    const microblog = getMicroblog('room', data.room);
    if (microblog) {
      // microblog exists
      microblog.messages.push({
        in: true,
        from: data.from,
        isFirstMsg: data.isFirstMsg,
        time: data.time,
        msg: data.msg,
      });
      microblog.offset++;
      setCurrentMicroBlog(microblog);
    } else {
      // if (NotificationService.groupChatModalIsOpen.isOpen !== true) {
      // new microblog
      MicroblogAPI.getMicroblog(data.room)
        .then((_microblog) => {
          openMicroblog(_microblog.data.users, _microblog.data.room);
        })
        .catch((err) => console.log('get microblog failed : ', err));
      // }
    }
  };

  const showNewUserInMicroblog = (data) => {
    UserAPI.getUserMeta(data.user).then((meta) => {
      console.log('user meata', meta);
      setNewUserMeta(meta.data);
      setMicroblogUsers([
        ...microblogUsers,
        {
          user_id: newUserMeta[0]._id,
          last_login: Date.now(),
          fname: newUserMeta[0].fname,
          lname: newUserMeta[0].lname,
          profilePic: newUserMeta[0].profile_pic,
        },
      ]);
    });
  };

  // this function shows me the image message my friend sent asynchronously
  const showImageMessage = (data) => {
    const microblog = getMicroblog('room', data.room);
    if (microblog) {
      let isNewDate = false;
      if (microblog.messages.length === 0) {
        isNewDate = true;
      } else if (microblog.messages.length > 0) {
        const lastMessagesTime = new Date(
          microblog.messages[microblog.messages.length - 1].time
        ).setHours(0, 0, 0, 0);
        const todaysDate = new Date(Date.now()).setHours(0, 0, 0, 0);

        if (lastMessagesTime === todaysDate) {
          isNewDate = false;
        } else if (lastMessagesTime !== todaysDate) {
          isNewDate = true;
        }
      }

      if (microblog.messages.length === 0) {
        microblog.messages.push({
          in: true,
          isImage: data.isImage,
          isFirstMsg: true,
          isNewDate: isNewDate,
          from: data.from,
          time: data.time,
          msg: data.msg,
          src: data.src,
          ownMsg: false,
        });
        microblog.offset++;
      } else if (microblog.messages.length > 0) {
        microblog.messages.push({
          in: true,
          isImage: data.isImage,
          isFirstMsg: false,
          isNewDate: isNewDate,
          from: data.from,
          time: data.time,
          msg: data.msg,
          src: data.src,
          ownMsg: false,
        });
        microblog.offset++;
      }
    }
  };

  const handleImageFileSelect = (evt) => {
    setFile(evt.target.files[0]);
    const microblogRoom = evt.target.id;
    const albumName = 'microblogs-image-message';
    const msgTime = Date.now();

    const fd = new FormData();
    fd.append('albumName', albumName);
    fd.append('file', File);
    fd.append('microblogRoom', microblogRoom);
    fd.append('message_type', 'image');
    fd.append('message', '');
    fd.append('from', auth.sess._id);

    MicroblogAPI.uploadImageMessage(fd).then((response) => {
      const microblog = getMicroblog('room', microblogRoom);
      let userExists = false;
      const data = {
        microblogRoom: microblog.room,
        user: microblog.me._id,
      };

      for (let i = 0; i < microblogUsers.length; i++) {
        if (microblogUsers[i].user_id === data.user) {
          userExists = true;
          i = microblogUsers.length;
        } else {
          userExists = false;
        }
      }

      if (userExists === false) {
        socket.emit('new-microblog-user', {
          room: data.microblogRoom,
          user: data.user,
        });

        UserAPI.getUserMeta(data.user).then((meta) => {
          console.log('user meata=====', meta);

          setNewUserMeta(meta.data);
          setMicroblogUsers([
            ...microblogUsers,
            {
              user_id: newUserMeta[0]._id,
              last_login: Date.now(),
              fname: newUserMeta[0].fname,
              lname: newUserMeta[0].lname,
              profilePic: newUserMeta[0].profile_pic,
            },
          ]);
        });
        bookmarkMicroblog(microblog);
      }

      if (socket) {
        var me = auth.sess._id;
        if (microblog.is_microblog) {
          const imgMsgData = {
            isImage: true,
            from: me,
            time: response.data.messages[0].time,
            msg: response.data.messages[0].message,
            src: response.data.messages[0].message,
            room: microblog.room,
          };
          socket.emit('microblog-image-message', microblogRoom, imgMsgData);
        }

        let isNewDate = false;
        if (microblog.messages.length === 0) {
          isNewDate = true;
        } else if (microblog.messages.length > 0) {
          const lastMessagesTime = new Date(
            microblog.messages[microblog.messages.length - 1].time
          ).setHours(0, 0, 0, 0);
          const todaysDate = new Date(Date.now()).setHours(0, 0, 0, 0);

          if (lastMessagesTime === todaysDate) {
            isNewDate = false;
          } else if (lastMessagesTime !== todaysDate) {
            isNewDate = true;
          }
        }

        if (microblog.messages.length === 0) {
          microblog.messages.push({
            in: false,
            isImage: true,
            isFirstMsg: true,
            isNewDate: isNewDate,
            from: me,
            time: response.data.messages[0].time,
            msg: response.data.messages[0].message,
            src: response.data.messages[0].message,
            ownMsg: true,
          });
          microblog.offset++;
        } else if (microblog.messages.length > 0) {
          microblog.messages.push({
            in: false,
            isImage: true,
            isFirstMsg: false,
            isNewDate: isNewDate,
            from: me,
            time: response.data.messages[0].time,
            msg: response.data.messages[0].message,
            src: response.data.messages[0].message,
            ownMsg: true,
          });
          microblog.offset++;
        }
      }
    });
  };

  const sendMicroblogMsgOnEnter = (event, microblog) => {
    if (event.which === 13) {
      sendMicroblogMsg(event.target.value, microblog);
      event.target.value = '';
    }
  };

  const sendMicroblogMsg = (msg, microblog) => {
    let userExists = false;
    const data = {
      microblogRoom: microblog.room,
      user: microblog.me._id,
    };

    for (let i = 0; i < microblogUsers.length; i++) {
      if (microblogUsers[i].user_id === data.user) {
        userExists = true;
        i = microblogUsers.length;
      } else {
        userExists = false;
      }
    }
    if (userExists === false) {
      socket.emit('new-microblog-user', {
        room: data.microblogRoom,
        user: data.user,
      });

      UserAPI.getUserMeta(data.user).then(function (meta) {
        setNewUserMeta(meta.data);
        setMicroblogUsers([
          ...microblogUsers,
          {
            user_id: newUserMeta[0]._id,
            last_login: Date.now(),
            fname: newUserMeta[0].fname,
            lname: newUserMeta[0].lname,
            profilePic: newUserMeta[0].profile_pic,
          },
        ]);
      });
      bookmarkMicroblog(microblog);
    }

    if (!msg || msg.trim() === '') {
      return;
    }

    msg = msg.trim();
    if (socket) {
      const me = auth.sess._id;
      if (microblog.is_microblog) {
        socket.emit('microblog-message', {
          room: microblog.room,
          from: me,
          msg: msg,
          time: Date.now(),
        });
      }

      let isNewDate = false;
      if (microblog.messages.length === 0) {
        isNewDate = true;
      } else if (microblog.messages.length > 0) {
        const lastMessagesTime = new Date(
          microblog.messages[microblog.messages.length - 1].time
        ).setHours(0, 0, 0, 0);
        const todaysDate = new Date(Date.now()).setHours(0, 0, 0, 0);

        if (lastMessagesTime === todaysDate) {
          isNewDate = false;
        } else if (lastMessagesTime !== todaysDate) {
          isNewDate = true;
        }
      }

      if (microblog.messages.length === 0) {
        const new_microblog = currentMicroblog;
        new_microblog.messages.push({
          in: false,
          isFirstMsg: true,
          isNewDate: isNewDate,
          from: me,
          time: Date.now(),
          msg: msg,
        });
        new_microblog.offset = parseInt(new_microblog.offset) + 1;
        setCurrentMicroBlog(new_microblog);
      } else if (microblog.messages.length > 0) {
        const new_microblog = currentMicroblog;
        new_microblog.messages.push({
          in: false,
          isFirstMsg: false,
          isNewDate: isNewDate,
          from: me,
          time: Date.now(),
          msg: msg,
        });
        new_microblog.offset = parseInt(new_microblog.offset) + 1;
        setCurrentMicroBlog(new_microblog);
      }
    }
    setMicroblogMessage('');
  };

  const openMicroblog = (users, room, name) => {
    let microblog = null;
    if (!room) {
      microblog = createRoomForMicroblog(users);
    } else if (room) {
      microblog = createRoomForMicroblog(users, room, name);
    }
    console.log('===open blog===', room);
    if (microblog) {
      // turn on socket.io callback listeners
      socket.on('loadMicroblogHistory', loadMicroblogHistoryFunction);
      socket.on('microblogMessage', handleMicroblogMessage);
      socket.on('microblog-image-message-to-friends', microblogImageMessage);
      socket.on('new-microblog-user', newMicroblogUser);

      // join the microblog room for messages
      socket.emit('join-room', {
        room: microblog.room,
      });

      socket.emit('open-microblog', {
        id: microblog.me._id,
        room: microblog.room,
      });
    }
  };

  const createRoomForMicroblog = (friends, room, name) => {
    let is_microblog = false;
    if (room) {
      is_microblog = true;
    } else {
      room = generateRoomNameForMicroblog(auth.sess._id, friends._id);
    }
    console.log('===room name===', getMicroblog('room', room));
    if (getMicroblog('room', room)) {
      const microblog = currentMicroblog;
      microblog.is_microblog = is_microblog;
      microblog.limit = 20;
      microblog.offset = 0;
      setCurrentMicroBlog(microblog);
      if (currentMicroblog.created_by === auth.sess._id) {
        setBookMarkClicked(true);
      }
      for (let i = 0; i < currentMicroblog.users.length; i++) {
        if (currentMicroblog.users[i].user_id === auth.sess._id) {
          setBookMarkClicked(true);
        }
      }
      setMicroBlogs([currentMicroblog]);
      return currentMicroblog;
    }
    return null;
  };

  const generateRoomNameForMicroblog = (me, friend) => {
    return me < friend ? me + '___' + friend : friend + '____' + me;
  };

  const loadMicroblogHistory = (microblog) => {
    const id = microblog.me._id;
    MicroblogAPI.loadMicroblogHistory(microblog, auth.sess._id)
      .then((response) => {
        const messages = response.data.map((item) => {
          let isImage = false;
          if (item.message_type === 'image') {
            isImage = true;
          }
          const microblogMsg = {
            from: item.from,
            isImage: isImage,
            time: item.time,
            msg: item.message ? item.message : '',
          };
          microblogMsg.in = item.from !== id;
          return microblogMsg;
        });
        for (let i = 0; i < messages.length; i++) {
          messages[messages.length - 1].isFirstMsg = true;
          microblog.messages.unshift(messages[i]);
        }

        for (let i = 0; i < messages.length - 1; i++) {
          messages[i].isFirstMsg = false;
        }

        for (let j = messages.length - 1; j >= 0; j--) {
          for (let k = j - 1; k >= 0; k--) {
            if (
              new Date(messages[j].time).setHours(0, 0, 0, 0) ===
              new Date(messages[k].time).setHours(0, 0, 0, 0)
            ) {
              messages[k].isNewDate = false;
            } else {
              messages[k].isNewDate = true;
            }
          }
        }

        microblog.offset += messages.length;
        return microblog;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

  const loadMore = (room) => {
    var microblog = getMicroblog('room', room);
    if (microblog) {
      loadMicroblogHistory(microblog);
    }
  };

  const scrollToBottomOfMicroblog = (room) => {};

  // closeMicroblog = function(microblog) {
  //     var index = microblogs.indexOf(microblog);
  //     if (index > -1) {
  //         socket.emit('close-microblog', {id: microblog.me._id, room: microblog.room});
  //         microblogs.splice(index, 1);
  //     }
  //     // microBlogCtrl.show = false;
  //     // Notification stuff here
  // };

  const getImageForMicroblog = (from, microblog) => {
    if (microblog.friends?.length > 0) {
      for (let i = 0; i < microblog.friends.length; i++) {
        if (microblog.friends[i].user_id === from) {
          return microblog.friends[i].profile_pic
            ? microblog.friends[i].profile_pic
            : uploadPhoto;
        }
      }
    } else {
      return uploadPhoto;
    }
  };

  const bookmarkMicroblog = (microblog) => {
    setBookMarkClicked(true);
    const reqInfo = {
      user: auth.sess._id,
      room: microblog.room,
    };
    MicroblogAPI.updateUserBookmarkedMicroblogs(reqInfo.user, reqInfo.room)
      .then((res) => console.log('===updated userbookmark success', res.data))
      .catch((err) => console.log('===update userbookmark err===', err));
  };
  const unBookmarkMicroblog = (microblog) => {
    setBookMarkClicked(true);

    const reqInfo = {
      user: auth.sess._id,
      room: microblog,
    };
    MicroblogAPI.unbookmarkMicroblog(reqInfo.user, reqInfo.room)
      .then((response) => console.log('unbookmark success', response.data))
      .catch((err) => {
        console.log('could not un-bookmark microblog:', err);
      });
    MicroblogAPI.removeUserFromMicroblog(reqInfo)
      .then((response) =>
        console.log('remove user from microblog success', response.data)
      )
      .catch((err) => {
        console.log('could not remove user from microblog: ', err);
      });
  };

  const bookmarkToggle = (microblog) => {
    if (bookmarkClicked) {
      unBookmarkMicroblog(microblog.room);
    } else {
      bookmarkMicroblog(microblog);
    }
  };

  const closeWindow = (microblog) => {
    const index = microblogs.indexOf(microblog);
    if (index > -1) {
      // turn off socket.io callback listeners
      socket.off('loadMicroblogHistory', loadMicroblogHistoryFunction);
      socket.off('microblogMessage', handleMicroblogMessage);
      socket.off('microblog-image-message-to-friends', microblogImageMessage);
      socket.off('new-microblog-user', newMicroblogUser);

      // leave microblog room for messages
      socket.emit('leave-room', {
        room: microblog.room,
      });

      socket.emit('close-microblog', {
        id: microblog.me._id,
        room: microblog.room,
      });
    }
    props.closeHandler();
  };

  const handleClose = () => {
    closeWindow(currentMicroblog);
    props.closeHandler();
  };
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{
        margin: '0 auto',
        width: '45%',
        top: '10%',
        overflow: 'scroll',
        height: '100%',
        display: 'block',
      }}
    >
      <>
        <div
          className="microbloggers"
          style={{height: '370px', overflowY: 'auto'}}
        >
          <div
            style={{paddingTop: '10px', width: '50px', height: '60px'}}
            ng-repeat="user in microblogUsers"
          >
            <img
              src={auth.sess.profile_pic ? auth.sess.profile_pic : uploadPhoto}
              style={{width: '45px', height: '45px', borderRadius: '50%'}}
              alt="users"
            />
          </div>
        </div>
        {microblogUsers?.length > 6 && (
          <div
            className="microbloggers"
            style={{
              top: '370px',
              paddingTop: '10px',
              width: '50px',
              height: '60px',
            }}
          >
            <button className="invite-button-orange">{moreUsers}+</button>
          </div>
        )}

        <div>
          {currentMicroblog && (
            <div style={{height: '660px'}}>
              <div className="popover-topnav-head">
                <div className="pop-purple-head">
                  <span style={{textAlign: 'left'}}>
                    {currentMicroblog.name}
                  </span>
                  <div
                    className="dropdown float-pop-morebtn"
                    style={{textAlign: 'right'}}
                  >
                    <button
                      className="btnd"
                      style={{padding: '0', border: 'none'}}
                      onClick={(e) => bookmarkToggle(currentMicroblog)}
                    >
                      <i
                        className={`fa fa-bookmark ${
                          bookmarkClicked
                            ? 'chat-bookmark-fill'
                            : 'chat-bookmark-no-fill'
                        }`}
                      />
                    </button>
                    <button
                      style={{padding: '0', border: 'none'}}
                      className="btnd"
                      onClick={showMyFriends}
                    >
                      <img
                        src={Add_User}
                        className="add-user-to-chat"
                        alt="add-user"
                      />
                    </button>
                    <button
                      style={{padding: '0', border: 'none'}}
                      className="btnd"
                      onClick={(e) => closeWindow(currentMicroblog)}
                    >
                      <i
                        className="fa fa-close add-user-to-chat"
                        style={{paddingTop: '5px'}}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="popover-topnav-subheading">
                <div
                  // ibg-scroller="{microblog.room}"
                  className="chat-wrap-pop"
                  style={{
                    float: 'left',
                    overflow: 'auto',
                    height: '550px',
                    backgroundColor: 'white',
                  }}
                >
                  {currentMicroblog.messages &&
                    currentMicroblog.messages.map((message, key) => (
                      <div key={key}>
                        {((message.isFirstMsg && message.in) ||
                          (message.in && message.isNewDate)) && (
                          <div
                            className="dayOfChat"
                            style={{width: '100%', textAlign: 'center'}}
                          >
                            {message.time}
                          </div>
                        )}
                        {message.in && !message.isImage && (
                          <div className="chat-bubble-wrap">
                            <div
                              style={{
                                position: 'absolute',
                                left: '0',
                                width: '8%',
                                minHeight: '10%',
                                paddingBottom: '10px',
                              }}
                            >
                              <img
                                ng-init="message.widthStyle={'max-width':'82%'}"
                                src={getImageForMicroblog(
                                  message.from,
                                  currentMicroblog
                                )}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  float: 'left',
                                  borderRadius: '50%',
                                  border: '4px solid rgba(97, 72, 161, 0.32)',
                                }}
                                alt="msgs"
                              />
                              <span
                                style={{paddingBottom: '30px'}}
                                className="chat-in-time"
                                ng-if="message.in"
                              >
                                {message.time}
                              </span>
                            </div>
                            <div className="chatBubble">{message.msg}</div>
                          </div>
                        )}
                        {((message.isFirstMsg && !message.in) ||
                          (!message.in && message.isNewDate)) && (
                          <div
                            className="dayOfChat"
                            style={{width: '100%', textAlign: 'center'}}
                          >
                            {message.time}
                          </div>
                        )}
                        {!message.in && !message.isImage && (
                          <div className="chat-bubble-wrap">
                            <div
                              style={{
                                position: 'absolute',
                                right: '0',
                                width: '8%',
                                minHeight: '10%',
                                paddingBottom: '10px',
                              }}
                            >
                              <img
                                ng-init="message.widthStyle={'max-width':'82%'}"
                                src={getImageForMicroblog(
                                  message.from,
                                  currentMicroblog
                                )}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  float: 'right',
                                  borderRadius: '50%',
                                  marginTop: '4px',
                                  border: '4px solid rgba(97, 72, 161, 0.32)',
                                }}
                                alt="msg.from"
                              />
                              <div
                                style={{paddingBottom: '30px'}}
                                className="chat-sent-time"
                                ng-if="!message.in"
                              >
                                {message.time}
                              </div>
                            </div>
                            <div className="arrow-right-group-chat"></div>
                            <div
                              className="chat-sent-bubble"
                              style={{maxWidth: '76%'}}
                            >
                              {message.message}
                            </div>
                          </div>
                        )}
                        {message.isImage && !message.in && (
                          <div className="chat-bubble-wrap">
                            <div
                              style={{
                                position: 'absolute',
                                right: '0',
                                width: '8%',
                                minHeight: '10%',
                                paddingBottom: '10px',
                              }}
                            >
                              <img
                                ng-init="message.widthStyle={'max-width':'82%'}"
                                src={getImageForMicroblog(
                                  message.from,
                                  currentMicroblog
                                )}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  float: 'right',
                                  borderRadius: '50%',
                                  marginTop: '4px',
                                  border: '4px solid rgba(97, 72, 161, 0.32)',
                                }}
                                alt="msgs_from"
                              />
                              <div
                                style={{paddingBottom: '30px'}}
                                className="chat-sent-time"
                                ng-if="!message.in"
                              >
                                {message.time}
                              </div>
                            </div>
                            <div className="arrow-right-group-chat"></div>
                            <div
                              className="chat-sent-bubble"
                              style={{maxWidth: '76%', padding: '3px'}}
                            >
                              <div>
                                <img
                                  ng-init="message.widthStyle={'max-width':'82%'}"
                                  src="{{message.msg}}"
                                  style={{
                                    width: '107px',
                                    height: '88px',
                                    float: 'right',
                                    marginTop: '4px',
                                    padding: '5px',
                                    borderRadius: '7%',
                                  }}
                                  alt="msg"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {message.isImage && message.in && (
                          <div className="chat-bubble-wrap">
                            <div
                              style={{
                                position: 'absolute',
                                left: '0',
                                width: '8%',
                                minHeight: '10%',
                                paddingBottom: '10px',
                              }}
                            >
                              <img
                                ng-init="message.widthStyle={'max-width':'82%'}"
                                src={getImageForMicroblog(
                                  message.from,
                                  currentMicroblog
                                )}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  float: 'left',
                                  borderRadius: '50%',
                                  border: '4px solid rgba(97, 72, 161, 0.32)',
                                }}
                                alt="msg_from"
                              />
                              <span
                                style={{paddingBottom: '30px'}}
                                className="chat-in-time"
                                ng-if="message.in"
                              >
                                {message.time}
                              </span>
                            </div>
                            <div className="chatBubble" style={{padding: '0'}}>
                              <div>
                                <img
                                  src={message.msg}
                                  style={{
                                    maxWidth: '82%',
                                    width: '107px',
                                    height: '88px',
                                    float: 'right',
                                    marginTop: '4px',
                                    padding: '5px',
                                    borderRadius: '7%',
                                  }}
                                  alt="msg"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="chat-reply-area" style={{width: '100%'}}>
                  <div className="col-md-12 col-sm-12 col-12 colPadZero">
                    <div
                      className="col-md-10 col-sm-10 col-10 colPadZero"
                      style={{width: '99%'}}
                    >
                      <div
                        className="chat-reply-txt"
                        style={{width: '100%', borderRadius: '8px'}}
                      >
                        <input
                          type="file"
                          name="microblog-message-file"
                          id={currentMicroblog.room}
                          className="inputfile"
                        />
                        <label
                          htmlFor={currentMicroblog.room}
                          className="btn btn-warning btn-flat send-image-button"
                          style={{
                            color: '#fff',
                            backgroundColor: '#5f45a1',
                            borderColor: '#5f45a1',
                            marginRight: '9px',
                          }}
                        >
                          <label
                            htmlFor={currentMicroblog.room}
                            style={{
                              cursor: 'pointer',
                              height: '100%',
                              width: '100%',
                            }}
                          >
                            <i className="glyphicon glyphicon-paperclip"></i>
                          </label>
                        </label>
                        <input
                          type="text"
                          onKeyPress={(e) =>
                            sendMicroblogMsgOnEnter(e, currentMicroblog)
                          }
                          className="chat-reply-form"
                          placeholder="Type something to send..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {myFriends.show && (
          <div
            style={{
              overflowY: 'auto',
              position: 'absolute',
              top: '10px',
              right: '0',
              left: '620px',
              bottom: '0',
              height: '450px',
              width: '55px',
              padding: '2px',
              background: 'transparent',
            }}
          >
            {myFriends.friends &&
              myFriends.friends.map((myFriend, unique) => (
                <div
                  style={{paddingTop: '10px', width: '50px', height: '60px'}}
                  key={unique}
                >
                  <img
                    id="friendImg{{myFriend._id}}"
                    src={
                      myFriend.profile_pic ? myFriend.profile_pic : uploadPhoto
                    }
                    style={{width: '45px', height: '45px', borderRadius: '50%'}}
                    onClick={(e) => selectFriend(myFriend._id)}
                    alt="userPic"
                  />
                </div>
              ))}

            <div
              style={{
                textAlign: 'center',
                paddingTop: '10px',
                width: '50px',
                height: '60px',
              }}
            >
              <button
                className={
                  myFriends.friends.length !== 0
                    ? 'invite-button-orange'
                    : 'invite-button-faded'
                }
                onClick={inviteFriends}
              >
                INVITE
              </button>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

export default Blog;
