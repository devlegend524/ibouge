import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';

import {logOutUser} from '../../actions/authActions';
import {setTitle} from '../../actions/commonAction';

import DropForm from '../DropForm';
import './styles.scss';

import logo from '../../assets/img/ibouge-home-logo.png';
import inboxEmpty from '../../assets/img/inbox-empty.png';
import notificationEmtpy from '../../assets/img/notification-empty.png';
import emptyUser from '../../assets/img/upload-photo.png';

const Navbar = (props) => {
  const [pageTitle, setPageTitle] = useState(props.title);
  const [showMailDrop, setShowMailDrop] = useState(false);
  const [showNotificationDrop, setShowNotificationDrop] = useState(false);
  const [showMenuDrop, setShowMenuDrop] = useState(false);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();

  const onLogOut = (event) => {
    // event.preventDefault();
    dispatch(logOutUser());
    history.push('/login');
  };
  useEffect(() => {
    dispatch(setTitle(pageTitle));
  }, [pageTitle, dispatch]);
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
                      src={inboxEmpty}
                      className="top-nav-icons btnd"
                      alt="inbox"
                    />
                  </button>
                  {showMailDrop && (
                    <DropForm name="Inbox" cName="mail-dropdown" />
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
                      src={notificationEmtpy}
                      className="top-nav-icons"
                      alt="notification"
                    />
                  </button>
                  {showNotificationDrop && (
                    <DropForm
                      name="Notification"
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
                      src={emptyUser}
                      className="top-nav-prof-icons"
                      alt="user"
                    />
                    <span className="top-prof-name">Dev Man</span>
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
