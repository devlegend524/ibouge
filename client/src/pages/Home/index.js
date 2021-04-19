import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Navbar from '../../components/Navbar';

// import MapCustom from './mapCustom';
import requireAuth from '../../hoc/requireAuth';
import {setTitle} from '../../actions/commonAction';
import {getAllMicroBlogs} from '../../actions/microblogAction';
import {getAllUsers} from '../../actions/userActions';
import {getAllEvents} from '../../actions/eventAction';

import UserList from './userList';
import BlogList from './blogList';
import EventList from './eventList';
import MapView from './map';
import {
  getArrayOfGeoJSON,
  getEventOfGetJson,
  getMicroBlogOfGeoJSON,
} from '../../helpers/utils';
import './styles.scss';

const Home = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const defaultUsersData = useSelector((state) => state.users.users);
  const defaultBlogData = useSelector((state) => state.blogs.blogs);
  const defaultEventsData = useSelector((state) => state.events.events);
  const [viewState, setViewState] = useState('users');
  const [users, setUsers] = useState(getArrayOfGeoJSON([auth.sess]));
  const handleViewState = (viewState) => {
    setViewState(viewState);
    if (viewState === 'users') {
      setUsers(getArrayOfGeoJSON(defaultUsersData));
    }
    if (viewState === 'blogs') {
      setUsers(getMicroBlogOfGeoJSON(defaultBlogData));
    }
    if (viewState === 'events') {
      setUsers(getEventOfGetJson(defaultEventsData));
    }
  };
  useEffect(() => {
    dispatch(setTitle('Homepage'));
    dispatch(getAllMicroBlogs());
    dispatch(getAllUsers());
    dispatch(getAllEvents());
  }, []);
  const handleFilteredData = (filteredData) => {
    setUsers(filteredData);
  };
  return (
    <>
      <Navbar title="Home" />
      <div className="home-page">
        {!auth.isAuthenticated ? (
          <div>
            <p>
              Welcome guest!{' '}
              <Link className="bold" to="/login">
                Log in
              </Link>{' '}
              or{' '}
              <Link className="bold" to="/register">
                Register
              </Link>
            </p>
          </div>
        ) : (
          <div className="h-100 w-100">
            <div id="floatMenu">
              <div className="float-btn">
                <div className="dropdown">
                  <a
                    className="btn float-btn-wrap"
                    onClick={() => handleViewState('users')}
                    onMouseOver={() => handleViewState('users')}
                  >
                    <img
                      src="img/prof-float-ico.png"
                      className="float-btn-icons"
                      alt="prof"
                    />
                  </a>
                </div>
              </div>

              <div className="float-btn">
                <div className="dropdown">
                  <button
                    className="btn float-btn-wrap"
                    type="button"
                    onClick={() => handleViewState('events')}
                    onMouseOver={() => handleViewState('events')}
                  >
                    <img
                      src="img/loc-float-ico.png"
                      className="float-btn-icons"
                      alt="float"
                    />
                  </button>
                </div>
              </div>
              <div className="float-btn">
                <div className="dropdown">
                  <button
                    className="btn  float-btn-wrap"
                    type="button"
                    onClick={() => handleViewState('blogs')}
                    onMouseOver={() => handleViewState('blogs')}
                  >
                    <img
                      src="img/chat-float-ico.png"
                      className="float-btn-icons"
                      alt="chat"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="hidden-xs"
              style={{width: '80%', height: '60%', marginTop: '58px'}}
            >
              <MapView
                height="550px"
                data={
                  viewState === 'users'
                    ? getArrayOfGeoJSON(defaultUsersData)
                    : viewState === 'blogs'
                    ? getMicroBlogOfGeoJSON(defaultBlogData)
                    : viewState === 'events'
                    ? getEventOfGetJson(defaultEventsData)
                    : []
                }
                type={viewState}
                handleFilteredData={handleFilteredData}
              />
            </div>
            <div
              className="visible-xs-block"
              style={{width: '80%', height: '60%', marginTop: '58px'}}
            >
              <MapView
                height="450px"
                data={
                  viewState === 'users'
                    ? getArrayOfGeoJSON(defaultUsersData)
                    : viewState === 'blogs'
                    ? getMicroBlogOfGeoJSON(defaultBlogData)
                    : viewState === 'events'
                    ? getEventOfGetJson(defaultEventsData)
                    : []
                }
                handleFilteredData={handleFilteredData}
              />
            </div>
            <div className="hidden-xs e-box">
              {viewState === 'users' && <UserList data={users} />}
              {viewState === 'events' && <EventList data={users} />}
              {viewState === 'blogs' && <BlogList data={users} />}
            </div>

            <div className="visible-xs-block">
              {viewState === 'users' && <UserList data={users} />}
              {viewState === 'events' && <EventList data={users} />}
              {viewState === 'blogs' && <BlogList data={users} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default requireAuth(Home);
