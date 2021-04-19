import React, {useEffect, useState, useContext, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import dateFormat from 'dateformat';
import {Picker} from 'emoji-mart';
import {Smile} from 'react-feather';
import {
  getAllStatusUpdates,
  postNewStatus,
  deleteStatus,
} from '../../actions/feedActions';
import {saveImageToBucket} from '../../api/feed';

import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';
import noImageAvailable from '../../assets/img/noImageAvailable.jpg';

const initialUpload = {
  src: '',
  type: '',
};

const Feed = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {statuses} = useSelector((state) => state.feed);
  const [socket] = useSocket(socketUrl);
  socket.connect();
  useEffect(() => {
    let interval = setInterval(function () {
      if (auth.sess) {
        socket.emit('addUserID', {
          id: auth.sess._id,
        });
        clearInterval(interval);
      }
    }, 3000);
  }, []);

  const [friendsStatusesOnlyShown, setFriendsStatusesOnlyShown] = useState(
    false
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mapStatusesOnlyShown, setMapStatusesOnlyShown] = useState(true);
  const [statusType] = useState('text');
  const [statusMessage, setStatusMessage] = useState('');
  const [postFile, setSelectedFile] = useState(initialUpload);
  const [upload, setUpload] = useState(initialUpload);
  const [allStatusUpdates, setAllStatusUpdates] = useState(statuses);
  useEffect(() => {
    dispatch(getAllStatusUpdates());
  }, [allStatusUpdates]);
  const addEmoji = (e) => {
    let sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach((el) => codesArray.push('0x' + el));
    let emoji = String.fromCodePoint(...codesArray);
    setStatusMessage(statusMessage + emoji);
  };
  const toogleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const attachedRef = useRef();
  const handlClickFileUpload = (e) => {
    document.querySelector('#uploadFile').click();
    // attachedRef.current.onInputClick();
  };
  const showOnlyFriendsUpdates = () => {
    setFriendsStatusesOnlyShown(true);
    setMapStatusesOnlyShown(false);
    const allStatuses = [];
    if (statuses.length > 0) {
      for (let i = 0; i < statuses.length; i++) {
        if (statuses[i].status.length > 0) {
          for (let j = 0; j < statuses[i].status.length; j++) {
            allStatuses.push(statuses[i].status[j]);
          }
        }
      }
    }
    const ownStatuses = _.filter(
      allStatuses,
      (allStatus) => allStatus.from === auth.sess._id
    );

    // getUserName(ownStatuses);
    setAllStatusUpdates(_.orderBy(ownStatuses, ['time'], ['asc']));
  };

  const showOnlyUsersInMapUpdates = () => {
    setFriendsStatusesOnlyShown(false);
    setMapStatusesOnlyShown(true);
  };

  const newStatus = (event, value) => {
    if (statusMessage !== '') {
      const timeOfStatus = Date.now();

      const albumName = 'status-updates';
      const timeOfMessage = Date.now();

      // data to send to database
      const data = {
        message: statusMessage,
        status_type: 'image',
        time: timeOfMessage,
        from: auth.sess._id,
      };

      // send new status-update to database through service
      saveImageToBucket(postFile, albumName, data).then(function (response) {
        if (response.Location) {
          setUpload({
            src: response.Location,
            type: response.type,
            mimeType: response.mimeType,
          });
        }
      });
      const statusData = {
        status_type: upload.type ? upload.type : 'text',
        time: timeOfStatus,
        from: auth.sess._id,
        message: statusMessage,
        userFullname: auth.sess.fname + ' ' + auth.sess.lname,
        likes: [],
        profilePic: auth.sess.profile_pic
          ? auth.sess.profile_pic
          : noImageAvailable,
        filename: upload.src,
        caption: statusMessage,
      };
      dispatch(postNewStatus(statusData));
      setTimeout(() => {
        socket.emit('new-status-update', {
          _id: allStatusUpdates[0]._id,
          message: allStatusUpdates[0].message,
          caption: allStatusUpdates[0].caption,
          status_type: allStatusUpdates[0].status_type,
          time: allStatusUpdates[0].time,
          from: allStatusUpdates[0].from,
          userFullname: auth.sess.fname + ' ' + auth.sess.lname,
          likes: allStatusUpdates[0].likes,
          profilePic: auth.sess.profile_pic,
        });
      }, 1000);

      setStatusMessage('');
    }
  };

  const removeThumbnail = () => {};

  const addLikeToStatusOrReply = (status, reply) => {
    let isStatusLike = true;
    let inStatusLikeList = false;
    let likesList = status.likes;

    const data = {
      status: status._id,
      me: auth._id,
      createdBy: status.from,
      type: 'status',
    };
    if (reply) {
      isStatusLike = false;
      data.reply = reply;
      data.type = 'comment';
      likesList = reply.likes;
    }

    // iterate through likes array to check if user has already liked event
    // if user is in array, inList variable will be equal to true, else false
    if (likesList && likesList.length > 0) {
      for (var i = 0; i < likesList.length; i++) {
        if (data.me === likesList[i].from) {
          inStatusLikeList = true;
          //if user is found, iteration will stop
          break;
        }
      }

      // if user is in the list of likes, user will be removed from list
      if (inStatusLikeList) {
        if (isStatusLike) {
          // here we find the index of the event in the myEvents array
          const a = allStatusUpdates
            .map(function (x) {
              return x._id;
            })
            .indexOf(data.status);

          // here we find the index of the user in the myEvents[a].likes array
          const likesIndex = allStatusUpdates[a].likes
            .map(function (y) {
              return y.from;
            })
            .indexOf(data.me);

          // with both of those indexes we can now update the local myEvents.likes array, which will affect
          // immediately the number of likes displayed\
          const newStatus = [...allStatusUpdates];
          newStatus[a].likes.splice(likesIndex, likesIndex + 1);
          setAllStatusUpdates([...newStatus]);
        } else {
          // here we find the index of the event in the myEvents array
          const a = allStatusUpdates
            .map(function (x) {
              return x._id;
            })
            .indexOf(data.status);

          // index found
          const r = allStatusUpdates[a].replies
            .map(function (x) {
              return x._id;
            })
            .indexOf(reply._id);

          // here we find the index of the user in the myEvents[a].likes array
          const likesIndex = allStatusUpdates[a].replies[r].likes
            .map(function (y) {
              return y.from;
            })
            .indexOf(data.me);
          const newStatus = [...allStatusUpdates];
          newStatus[a].replies[r].likes.splice(likesIndex, likesIndex + 1);
          setAllStatusUpdates([...newStatus]);
        }

        // but database also needs to be updated, here
        socket.emit('remove-status-like', data);
        return;
      }
    }
    // index found
    const c = allStatusUpdates
      .map(function (x) {
        return x._id;
      })
      .indexOf(data.status);

    // local array updated

    if (isStatusLike) {
      const newStatus = [...allStatusUpdates];
      newStatus[c].likes.push({from: data.me, date: Date.now()});
      setAllStatusUpdates([...newStatus]);
    } else {
      // index found
      const d = allStatusUpdates[c].replies
        .map(function (x) {
          return x._id;
        })
        .indexOf(reply._id);

      const newStatus = [...allStatusUpdates];
      if (!newStatus[c].replies[d].likes) {
        newStatus[c].replies[d].likes = [];
      }
      newStatus[c].replies[d].likes.push({
        from: data.me,
        date: Date.now(),
      });
      setAllStatusUpdates([...newStatus]);
    }

    // database updated
    socket.emit('add-status-like', data);
  };

  const showsLikesList = () => {};

  const newReply = (event, status) => {
    if (event.which === 13) {
      if (event.target.value === '') {
        console.log('nothing was typed');
      } else {
        const timeOfStatus = Date.now();
        const c = allStatusUpdates
          .map(function (x) {
            return x._id;
          })
          .indexOf(status._id);
        const data = {
          status_id: status._id,
          message: event.target.value,
          reply_type: 'text',
          time: timeOfStatus,
          from: auth.sess._id,
          userFullname: auth.sess.fname + ' ' + auth.sess.lname,
          profilePic: auth.sess.profile_pic,
          caption: '',
          _id: null,
        };
        const newStatus = [...allStatusUpdates];
        newStatus[c].replies.push(data);
        setAllStatusUpdates([...newStatus]);
        socket.emit('add-reply', data);
        event.target.value = '';
      }
    }
  };
  const removeStatus = (status) => {
    if (window.confirm('Are you sure to delete this status?')) {
      dispatch(
        deleteStatus({
          id: status._id,
          from: status.from,
        })
      );
      setAllStatusUpdates([
        ...allStatusUpdates.filter((item) => item._id !== status._id),
      ]);
    }
  };
  const getUserName = (ownStatuses) => {
    for (let id = 0; id < ownStatuses.length; id++) {
      const tmp_id = id;
      let profilePic = '';
      const response = axios.get(
        `users/get-user-meta?id=${ownStatuses[id].from}`
      );
      var fname = response.data[0].fname;
      var lname = response.data[0].lname;
      if (
        !response.data[0].profile_pic ||
        response.data[0].profile_pic === ''
      ) {
        profilePic = noImageAvailable;
      } else {
        profilePic = response.data[0].profile_pic;
      }
      try {
        ownStatuses[tmp_id].userFullname = fname + ' ' + lname;
        ownStatuses[tmp_id].profile_pic = profilePic;
      } catch (err) {
        console.log(err);
      }
      if (ownStatuses[tmp_id].replies) {
        for (var j = 0; j < ownStatuses[tmp_id].replies.length; j++) {
          const tmp_j = j;
          const sResponse = axios.get(
            `users/get-user-meta?id=${ownStatuses[tmp_id].replies[j].from}`
          );
          fname = sResponse.data[0].fname;
          lname = sResponse.data[0].lname;
          if (
            !sResponse.data[0].profile_pic ||
            sResponse.data[0].profile_pic === ''
          ) {
            profilePic = noImageAvailable;
          } else {
            profilePic = sResponse.data[0].profile_pic;
          }
          try {
            ownStatuses[tmp_id].replies[tmp_j].userFullname =
              fname + ' ' + lname;
            ownStatuses[tmp_id].replies[tmp_j].profile_pic = profilePic;
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  };

  return (
    <div className="user-event-box" style={{height: '916px'}}>
      <div>
        <h4 className="status-update-box-heading" style={{boxShadow: 'none'}}>
          Newsfeed
          <span
            className="event-box-heading-add-event btnd"
            onClick={showOnlyFriendsUpdates}
            style={{
              cursor: 'pointer',
              color: friendsStatusesOnlyShown ? '#6148a1' : '#ffb940',
            }}
          >
            FRIENDS
          </span>
          <span
            className="event-box-heading-add-event btnd"
            onClick={showOnlyUsersInMapUpdates}
            style={{
              cursor: 'pointer',
              marginRight: '25px',
              color: mapStatusesOnlyShown ? '#6148a1' : '#ffb940',
            }}
          >
            EVERYONE
          </span>
          {/* <a href="" className="event-box-heading-add-event btnd visible-xs" ng-click="showOnlyFriendsUpdates();"
            ng-style="{color: friendsStatusesOnlyShown === true ? '#6148a1' : '#ffb940'}"
            style="font-size:0.7em">FRIENDS</a>
          <a href="" style="margin-right: 7px;font-size: 0.7em;"
            className="event-box-heading-add-event btnd visible-xs" ng-click="showOnlyUsersInMapUpdates();"
            ng-style="{color: mapStatusesOnlyShown === true ? '#6148a1' : '#ffb940'}">EVERYONE</a> */}
        </h4>
        <div style={{padding: '5px'}}>
          <div
            className="col-md-1 col-sm-1"
            style={{
              padding: '0px',
            }}
          >
            <input
              ref={attachedRef}
              type="file"
              name="file"
              id="uploadFile"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="inputfile"
              caption={statusMessage}
            />
            <button
              className="upload-pic-status-button"
              style={{
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                border: '2px solid #dadce8',
                backgroundColor: 'white',
                padding: '9px 12px 8px 12px',
              }}
              onClick={(e) => handlClickFileUpload()}
            >
              <i className="fa fa-paperclip"></i>
            </button>
            <input
              type="hidden"
              value={statusMessage}
              name="status"
              id="status-hidden-input"
            />
          </div>
          <div
            className="col-md-8 col-sm-8 col-12"
            style={{
              padding: '0px',
            }}
          >
            <textarea
              rows="1"
              className="form-control status-message"
              placeholder="What's on your mind?"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              style={{
                height: '7%',
                borderRadius: '5px',
                border: '2px solid #dadce8',
                fontSize: '1.3em',
                resize: 'none',
              }}
            />
          </div>
          <div
            className="col-md-1 col-sm-1"
            style={{
              padding: '0px',
            }}
          >
            <span>
              {showEmojiPicker ? (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: 'absolute',
                    right: '10px',
                  }}
                />
              ) : null}
            </span>
            <button
              type="button"
              className="toggle-emoji"
              onClick={toogleEmojiPicker}
              style={{
                borderRadius: '5px',
                border: '2px solid #dadce8',
                fontSize: '1.3em',
                resize: 'none',
              }}
            >
              <Smile />
            </button>
          </div>
          <div
            className="col-md-2 col-sm-2"
            style={{
              padding: '0px',
            }}
          >
            <button
              style={{
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                border: '2px solid #dadce8',
                backgroundColor: 'white',
                padding: '9px 12px 9px 12px',
                boxShadow: 'unset',
                fontWeight: '600',
              }}
              onClick={(e) => newStatus(e, statusMessage)}
            >
              Post
            </button>
          </div>
          {upload.src && <div style={{clear: 'both'}}></div>}
          {upload.type === 'image' && (
            <div className="thumbnail">
              <Link to="" onClick={removeThumbnail}>
                <i
                  className="fa fa-times"
                  style={{
                    float: 'right',
                    marginRight: '7px',
                    marginBottom: '3%',
                    marginTop: '2%',
                  }}
                />
              </Link>
              <img
                className="img-responsive"
                src={upload.src ? upload.src : noImageAvailable}
                style={{marginBottom: '10px'}}
                alt="upload"
              />
            </div>
          )}
          {upload.type === 'video' && (
            <div className="thumbnail">
              <Link to="" onClick={removeThumbnail}>
                <i
                  className="fa fa-times"
                  style={{
                    float: 'right',
                    marginRight: '7px',
                    marginBottom: '3%',
                    marginTop: '2%',
                  }}
                />
              </Link>
              <video
                width="320"
                height="240"
                poster="/images/w3html5.gif"
                controls
                className="img-responsive"
                muted
              >
                <source src={upload.src} type={upload.mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
      <div style={{height: '84%', width: '100%', overflowY: 'auto'}}>
        {allStatusUpdates.length === 0 && (
          <div className="status-updates-wrap-converse">
            <div className="col-7">
              <div className="text-center" style={{padding: '10px 0 0 0'}}>
                <h4>
                  Sorry! No posts available for this location yet. Check out
                  another location
                </h4>
              </div>
            </div>
          </div>
        )}
        {allStatusUpdates &&
          allStatusUpdates.map((status, index) => (
            <div key={index} className="status-updates-wrap-converse">
              <div className="col-md-11 col-sm-11 col-xs-11 colPadZero">
                <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                  <Link to={`/profile/${status.from}`}>
                    <img
                      src={
                        status.profile_pic
                          ? status.profile_pic
                          : noImageAvailable
                      }
                      className="events-convers-img"
                      alt="events"
                    />
                  </Link>
                </div>
                <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
                  <div
                    className="event-heading-style"
                    style={{padding: '10px 0 0 0'}}
                  >
                    <span>{status.userFullname}</span>
                  </div>
                  <div
                    className="event-sub-heading-style"
                    style={{textTransform: 'none', padding: 0}}
                  >
                    <span style={{fontSize: '15px'}}>
                      {status.time &&
                        dateFormat(new Date(status.time), 'mmmm dd')}{' '}
                      at{' '}
                      {status.time &&
                        dateFormat(new Date(status.time), 'shortTime')}
                    </span>
                  </div>
                </div>
              </div>
              {status.from === auth.sess._id && (
                <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
                  <a onClick={(e) => removeStatus(status)}>
                    <i
                      className="fa fa-times"
                      style={{
                        float: 'right',
                        marginRight: '7px',
                        marginTop: '10px',
                      }}
                    ></i>
                  </a>
                </div>
              )}
              <div className="col-md-12 col-sm-12 col-xs-12 colPadZero">
                <div
                  className={
                    statusType === 'image' || statusType === 'video'
                      ? 'hidden'
                      : 'event-heading-convers'
                  }
                  style={{
                    fontSize: '1.6em',
                    padding: '25px',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                  }}
                >
                  <p>{status.message}</p>
                </div>
                {status.caption !== '' && (
                  <div
                    className={
                      statusType === 'text' ? 'hidden' : 'event-heading-convers'
                    }
                    style={{
                      fontSize: '1.6em',
                      padding: '25px',
                      textAlign: 'center',
                      whiteSpace: 'normal',
                    }}
                  >
                    {/* <p ng-bind-html="status.caption | linky:'_blank'"></p> */}
                  </div>
                )}
                {status.message?.includes('https://www.youtube.com/') && (
                  <iframe
                    style={{width: '100%', height: '315px', padding: '5px'}}
                    src={status.message}
                    frameborder="0"
                    title="youtube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                )}
                <Link to={`/${status.message}`}>
                  {statusType === 'image' && (
                    <img
                      src={status.message ? status.message : noImageAvailable}
                      style={{width: '100%', marginTop: '4px', padding: '5px'}}
                      alt="status"
                    />
                  )}
                </Link>
                {statusType === 'video' && (
                  <video
                    controls
                    style={{width: '100%', marginTop: '4px', padding: '5px'}}
                    muted
                  >
                    <source src={status.message} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 colPadZero comment-section">
                <input
                  placeholder="Write a comment!"
                  style={{
                    width: '88%',
                    height: '5%',
                    borderRadius: '5px',
                    textAlign: 'left',
                    border: '2px solid #dadce8',
                    fontSize: '1.2em',
                    resize: 'none',
                    float: 'left',
                    marginBottom: '10px',
                    marginLeft: '5px',
                    textIndent: '10px',
                  }}
                  // emoji-picker="emoji-picker" emoji-attachment-location="top left"
                  // emoji-menu-location="bottom right" ng-model="status.reply.message"
                  onKeyPress={(event) => newReply(event, status)}
                  id={`comment-${status._id}`}
                />
                <a className="status-update-like">
                  <i
                    className={
                      status.likes?.length > 0
                        ? 'fa fa-heart status-update-box-liked'
                        : 'fa fa-heart'
                    }
                    onClick={() => addLikeToStatusOrReply(status)}
                    aria-hidden="true"
                  ></i>
                  {status.likes?.length > 0 && (
                    <span
                      onClick={() => showsLikesList(status.likes)}
                      aria-hidden="true"
                    >
                      {status.likes?.length}
                    </span>
                  )}
                </a>
              </div>
              {status.replies &&
                status.replies.map((reply, index) => (
                  <div
                    key={index}
                    className="status-updates-wrap-converse"
                    style={{width: '99%', padding: 0}}
                  >
                    <div className="col-md-2 col-sm-2 col-xs-2 colPadZero"></div>
                    <div
                      className="col-md-9 col-sm-9 col-xs-9 colPadZero"
                      style={{borderLeft: '3px solid #000'}}
                    >
                      <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                        <Link to={`/profile/${reply.from}`}>
                          <img
                            src={
                              reply.profile_pic
                                ? reply.profile_pic
                                : noImageAvailable
                            }
                            className="events-convers-img-small"
                            alt="event"
                          />
                        </Link>
                      </div>
                      <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
                        <div
                          className="event-heading-style-small"
                          style={{padding: '10px 0 0 0'}}
                        >
                          <span className="ng-binding">
                            {reply.userFullname}
                          </span>
                        </div>
                        <div
                          className="event-sub-heading-style-small"
                          style={{textTransform: 'none', padding: 0}}
                        >
                          <span style={{fontSize: '15px'}}>
                            {dateFormat(new Date(reply.time), 'mmmm dd')} at{' '}
                            {dateFormat(new Date(reply.time), 'shortTime')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {(reply.from === auth.sess._id ||
                      status.from === auth.sess._id) && (
                      <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
                        {/* <a ng-confirm-click="Are you sure to delete this reply?"
                confirmed-click="removeReply(reply, status)"><i className="fa fa-times"
                  style={{ float: 'right', marginRight: '7px', marginTop: '4px' }}></i></a> */}
                      </div>
                    )}
                    <br />
                    <div className="col-md-2 col-sm-2 col-xs-2 colPadZero"></div>
                    <div
                      className="col-md-9 col-sm-9 col-xs-9 colPadZero"
                      style={{borderLeft: '3px solid #000'}}
                    >
                      <div className="col-md-2 col-sm-2 col-xs-2 colPadZero"></div>
                      {reply.reply_type === 'text' && (
                        <div
                          className="col-md-9 col-sm-9 col-xs-9 event-heading-convers"
                          style={{
                            fontSize: '1.1em',
                            padding: '2px',
                            textAlign: 'left',
                            whiteSpace: 'normal',
                          }}
                        >
                          <p style={{marginBottom: 0}}>{reply.message}</p>
                          <a
                            className="status-update-like"
                            style={{margin: '2px'}}
                          >
                            <i
                              className={
                                reply.likes?.length > 0
                                  ? 'status-update-box-liked fa fa-heart'
                                  : 'fa fa-heart'
                              }
                              onClick={() =>
                                addLikeToStatusOrReply(status, reply)
                              }
                              aria-hidden="true"
                            />
                            {reply.likes?.length > 0 && (
                              <span
                                onClick={() => showsLikesList(reply.likes)}
                                aria-hidden="true"
                              >
                                {reply.likes.length}
                              </span>
                            )}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Feed;
