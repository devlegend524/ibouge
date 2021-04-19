import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';
import DropForm from '../DropForm';

import {logOutUser} from '../../actions/authActions';
import {setTitle} from '../../actions/commonAction';
import {loadMeta} from '../../actions/userActions';
import {loadMyInbox} from '../../actions/inboxAction';

import {
  newNotification,
  loadNotifications,
} from '../../actions/notificationAction';

import './styles.scss';

import logo from '../../assets/img/ibouge-home-logo.png';
import inboxEmpty from '../../assets/img/inbox-empty.png';
import inboxExist from '../../assets/img/inbox.png';
import notificationEmtpy from '../../assets/img/notification-empty.png';
import notificationExist from '../../assets/img/notification.png';
import emptyUser from '../../assets/img/upload-photo.png';

const Navbar = (props) => {
  const [pageTitle] = useState(props.title);
  const auth = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notification);
  const inbox = useSelector((state) => state.inbox);

  const [showMailDrop, setShowMailDrop] = useState(false);
  const [showNotificationDrop, setShowNotificationDrop] = useState(false);
  const [showMenuDrop, setShowMenuDrop] = useState(false);
  const [myInbox, setMyInbox] = useState(inbox);
  const [myNotifications, setMyNotification] = useState(notifications);

  const dispatch = useDispatch();
  const history = useHistory();

  const [socket] = useSocket(socketUrl);
  socket.connect();

  const onLogOut = () => {
    // event.preventDefault();
    dispatch(logOutUser());
    history.push('/login');
  };
  useEffect(() => {
    dispatch(setTitle(pageTitle));
    dispatch(loadNotifications());
    dispatch(loadMyInbox());
    let interval = setInterval(function () {
      if (!auth.sess.is_online) {
        socket.emit('addUserID', {
          id: auth.sess._id,
        });
        clearInterval(interval);
      }
    }, 3000);
    socket.on('new-notification-to-show', function (event) {
      dispatch(newNotification({hasmessage: true}));
      dispatch(loadNotifications());
      setMyNotification({
        ...myNotifications,
        hasNewMessage: true,
      });
    });
    socket.on('newNotification', function (data) {
      console.log('====recieved new notification====', data);
      if (myNotifications.isOpen) {
        dispatch(loadNotifications());
      } else if (myInbox.isOpen) {
        dispatch(loadNotifications());
        dispatch(loadMyInbox());
      } else {
        dispatch(loadMeta());
      }
    });

    socket.on('presence', function (presenceData) {
      const newData = [...myInbox.data];
      if (myInbox.data[0] && myInbox.data[0].users) {
        for (let j = 0; j < myInbox.data.length; j++) {
          for (let i = 0; i < myInbox.data[j].users.length; i++) {
            if (myInbox.data[j].users[i].user_id === presenceData.user_id) {
              newData[j].is_online = presenceData.status;
              break;
            }
          }
        }
        setMyInbox({...myInbox, data: newData});
      }
    });
  }, []);
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-controls="#bs-example-navbar-collapse-1"
            aria-expanded="false"
            style={{
              marginTop: '8px',
              marginBottom: '0px',
              marginRight: '15px',
            }}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav">
            <li className="navi-heads-subhead">
              <Link to="/mydashboard">MY DASHBOARD</Link>
            </li>
            <li className="navi-heads-subhead">
              <Link to="/mapOverview">MAP OVERVIEW</Link>
            </li>
            <li className="navi-heads-subhead">
              <Link to={`/profile/${auth.sess?._id}`}>MY PROFILE</Link>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <div className="header-search">
                <input
                  id="searchText"
                  type="text"
                  className="search-form"
                  placeholder="Type to search..."
                />
                <button className="btn  search-form-search-btn" type="button">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </li>
            <li className="hidden-xs">
              <div className="header-search">
                <div className="btn-group">
                  <button
                    className="btn  search-form-search-btn"
                    type="button"
                    onClick={() => {
                      setShowMailDrop(!showMailDrop);
                      if (!showMailDrop && showNotificationDrop)
                        setShowNotificationDrop(!showNotificationDrop);
                    }}
                  >
                    <img
                      src={myInbox.hasNewMessage ? inboxExist : inboxEmpty}
                      className="top-nav-icons btnd"
                      alt="inbox"
                    />
                  </button>
                  {showMailDrop && (
                    <DropForm
                      name="Inbox"
                      data={myInbox}
                      cName="mail-dropdown"
                    />
                  )}
                </div>
              </div>
            </li>
            <li className="hidden-xs">
              <div className="header-search">
                <div className="btn-group">
                  <button
                    className="btn  dropdown-toggle search-form-search-btn"
                    type="button"
                    onClick={() => {
                      setShowNotificationDrop(!showNotificationDrop);
                      if (!showNotificationDrop && showMailDrop)
                        setShowMailDrop(!showMailDrop);
                    }}
                  >
                    <img
                      src={
                        myNotifications.hasNewMessage
                          ? notificationExist
                          : notificationEmtpy
                      }
                      className="top-nav-icons"
                      alt="notification"
                    />
                  </button>
                  {showNotificationDrop && (
                    <DropForm
                      name="Notification"
                      data={myNotifications}
                      cName="notification-dropdown"
                    />
                  )}
                </div>
              </div>
            </li>
            <li className="hidden-xs">
              <div className="header-search">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn  dropdown-toggle search-form-prof-btn"
                    id="dropdownMenu1"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={() => setShowMenuDrop(!showMenuDrop)}
                  >
                    <img
                      src={
                        auth.sess.profile_pic
                          ? auth.sess.profile_pic
                          : emptyUser
                      }
                      className="top-nav-prof-icons"
                      alt="user"
                    />
                    <span className="top-prof-name">
                      {auth.sess?.fname} {auth.sess?.lname}
                    </span>
                    <span className="caret prof-name-drop-ico"></span>
                  </button>
                  <ul
                    className={
                      showMenuDrop
                        ? 'dropdown-menu showMenuDrop'
                        : 'dropdown-menu'
                    }
                    aria-labelledby="dropdownMenu1"
                    role="menu"
                  >
                    <li>
                      <Link to="/myprofilesettings">Profile</Link>
                    </li>
                    <li>
                      <Link to="/myprofilesettings">Account</Link>
                    </li>
                    <li>
                      <Link to="/myprofilesettings">Privacy</Link>
                    </li>
                    <li>
                      <Link to="/myprofilesettings">Notifications</Link>
                    </li>
                    <li className="divider hidden-xs"></li>
                    <li style={{cursor: 'pointer'}}>
                      <a onClick={() => onLogOut()}>Sign Out</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
