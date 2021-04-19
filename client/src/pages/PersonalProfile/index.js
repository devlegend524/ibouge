import React, {useEffect, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import requireAuth from '../../hoc/requireAuth';
import {MapContainer, TileLayer} from 'react-leaflet';
import {openPersonalChat} from '../../actions/chatAction';

import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';
import {getAllUsers} from '../../actions/userActions';

import {
  getUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  unfriend,
} from '../../actions/userActions';
import './styles.scss';
import 'leaflet/dist/leaflet.css';

import uploadPhoto from '../../assets/img/upload-photo.png';
import {indexOf} from 'lodash';

const PersonalProfile = () => {
  const param = useParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [socket] = useSocket(socketUrl);
  socket.connect();
  const profileState = useSelector((state) => state.users.profile);
  const getMyFriends = useSelector((state) => state.users.friends);
  const [profile, setProfile] = useState(profileState);
  const [friend_status, setFriendStatus] = useState(2);
  const [coordinates] = useState(
    profileState.location?.coordinates
      ? profileState.location.coordinates
      : [37.7577888643969, -122.43022710461835]
  );
  const [showInviteBtns, setShowInviteBtns] = useState(
    auth.sess._id !== profile.id
  );
  const inviteToChat = () => {
    dispatch(openPersonalChat(profile));
  };
  useEffect(() => {
    let interval = setInterval(function () {
      if (auth.sess) {
        socket.emit('addUserID', {
          id: auth.sess._id,
        });
        clearInterval(interval);
      }
    }, 3000);
    dispatch(getUserProfile(param.id));
  }, []);
  useEffect(() => {
    socket.on('newNotification', function (data) {
      console.log('accepted new notification on personal profile page'.data);
      if (data.type) {
        switch (data.type) {
          case 'addAsFriend':
            setFriendStatus(-1);
            break;
          case 'unfriend':
            setFriendStatus(0);
            break;
          case 'acceptFriendRequest':
            setFriendStatus(2);
            break;
          default:
            setFriendStatus(1);
            break;
        }
      }
    });
  }, []);

  useEffect(() => {
    setProfile(profileState);
    setShowInviteBtns(auth.sess._id !== profile.id);
    const index = auth.sess.friend_requests_sent?.indexOf(param.id);
    if (index < -1) {
      setFriendStatus(-1);
    } else {
      setFriendStatus(1);
    }
    const indexFriend = profile.friend_requests_sent?.indexOf(auth.sess._id);
    if (indexFriend > -1) {
      setFriendStatus(2);
    }
    const friendsIndex = getMyFriends.filter(
      (friend) => friend._id === param.id
    );
    if (friendsIndex.length > 0) {
      setFriendStatus(0);
    }
  }, [profileState]);

  const addAsFriend = () => {
    socket.emit('new-notification', {
      from: auth.sess._id,
      to: param.id,
      type: 'acceptFriendRequest',
    });
  };
  const acceptFriend = () => {
    console.log('====trying to accept request');
    socket.emit('new-notification', {
      from: auth.sess._id,
      to: param.id,
      type: 'unfriend',
    });
  };
  const unfriendUser = () => {
    socket.emit('new-notification', {
      from: auth.sess._id,
      to: param.id,
      type: 'addAsFriend',
    });
  };
  return (
    <>
      <Navbar title="Profile" />
      <section>
        {profile.account_type === '0' ? (
          <div className="container-fluid" id="logoBrand">
            <div className="">
              <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
              <div className="col-md-5 col-sm-5 col-xs-12 pb-20">
                <div className="col-md-12 col-sm-12 col-xs-12 text-left colPadZero">
                  <div className="col-md-5 col-sm-5 col-xs-12 ">
                    <img
                      src={
                        profile.profile_pic ? profile.profile_pic : uploadPhoto
                      }
                      className="userprof-img-large"
                      alt="UPLOAD"
                    />
                  </div>
                  <div className="col-md-7 col-sm-7 col-xs-12 user-prof-name-pad hidden-xs">
                    <h3 className="user-prof-name">
                      {profile?.fname} {profile?.lname}
                    </h3>
                  </div>
                  <div className="col-md-7 col-sm-7 col-xs-12 user-prof-name-pad visible-xs">
                    <h3 className="xs-h3">
                      {profile?.fname} {profile?.lname}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-sm-5 col-xs-12">
                {showInviteBtns && (
                  <div className="col-md-12 col-sm-12 col-xs-12 text-center  user-prof-btns-pad">
                    <div className="hidden-xs">
                      <button
                        type="button"
                        className="btn btn-primary chat-invite-purple-btn"
                        onClick={inviteToChat}
                      >
                        INVITE TO CHAT
                      </button>
                      {friend_status < 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={addAsFriend}
                        >
                          ADD AS FRIEND
                        </button>
                      )}
                      {friend_status === 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={unfriendUser}
                        >
                          UNFRIEND
                        </button>
                      )}
                      {friend_status === 1 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                        >
                          FRIEND REQUEST SENT
                        </button>
                      )}
                      {friend_status === 2 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={acceptFriend}
                        >
                          ACCEPT FRIEND REQUEST
                        </button>
                      )}
                    </div>
                    <div className="visible-xs">
                      <button
                        type="button"
                        className="btn btn-primary chat-invite-purple-btn-sm"
                        onClick={inviteToChat}
                      >
                        INVITE TO CHAT
                      </button>
                      {friend_status < 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={addAsFriend}
                        >
                          ADD AS FRIEND
                        </button>
                      )}
                      {friend_status === 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={unfriendUser}
                        >
                          UNFRIEND
                        </button>
                      )}
                      {friend_status === 1 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                        >
                          FRIEND REQUEST SENT
                        </button>
                      )}
                      {friend_status === 2 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={acceptFriendRequest}
                        >
                          ACCEPT FRIEND REQUEST
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
          </div>
        ) : (
          <div
            className="container-fluid"
            id="logoBrand-business"
            style={{
              backgroundImage: `url(${auth.sess.profile_pic})`,
              backgroundSize: '100% 100%',
            }}
          >
            <div className="">
              <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
              <div className="col-md-5 col-sm-5 col-xs-12 pb-20">
                <div className="col-md-12 col-sm-12 col-xs-12 text-left colPadZero">
                  <div className="col-md-5 col-sm-5 col-xs-12 "></div>
                  <div className="col-md-7 col-sm-7 col-xs-12 user-prof-name-pad hidden-xs">
                    <h3 className="user-prof-name">
                      {profile?.fname} {profile?.lname}
                    </h3>
                  </div>
                  <div className="col-md-7 col-sm-7 col-xs-12 user-prof-name-pad visible-xs">
                    <h3 className="xs-h3">
                      {profile?.fname} {profile?.lname}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-sm-5 col-xs-12">
                {showInviteBtns && (
                  <div className="col-md-12 col-sm-12 col-xs-12 text-center  user-prof-btns-pad">
                    <div className="hidden-xs">
                      <button
                        type="button"
                        className="btn btn-primary chat-invite-purple-btn"
                        onClick={inviteToChat}
                      >
                        INVITE TO CHAT
                      </button>
                      {friend_status < 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={addAsFriend}
                        >
                          ADD AS FRIEND
                        </button>
                      )}
                      {friend_status === 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={unfriendUser}
                        >
                          UNFRIEND
                        </button>
                      )}
                      {friend_status === 1 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                        >
                          FRIEND REQUEST SENT
                        </button>
                      )}
                      {friend_status === 2 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={acceptFriend}
                        >
                          ACCEPT FRIEND REQUEST
                        </button>
                      )}
                    </div>
                    <div className="visible-xs">
                      <button
                        type="button"
                        className="btn btn-primary chat-invite-purple-btn-sm"
                        onClick={inviteToChat}
                      >
                        INVITE TO CHAT
                      </button>
                      {friend_status < 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={addAsFriend}
                        >
                          ADD AS FRIEND
                        </button>
                      )}
                      {friend_status === 0 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={unfriendUser}
                        >
                          UNFRIEND
                        </button>
                      )}
                      {friend_status === 1 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                        >
                          FRIEND REQUEST SENT
                        </button>
                      )}
                      {friend_status === 2 && (
                        <button
                          type="button"
                          className="btn btn-primary chat-invite-orange-btn"
                          onClick={acceptFriendRequest}
                        >
                          ACCEPT FRIEND REQUEST
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
          </div>
        )}
        <div className="container-fluid">
          <div className="row p-2per">
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
            <div className="col-md-5 col-sm-5 col-xs-12">
              {/* {profile.profile?.about_me.trim() && ( */}
              <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes">
                <h4 className="user-prof-summary-head">
                  No summary has been added
                </h4>
                <span className="user-prof-summary">
                  {profile?.fname} {profile?.lname} hasn't had <br />a chance to
                  add a summary.
                </span>
              </div>
              {/* )} */}
              {/* {profile.profile?.about_me.trim() && ( */}
              <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes">
                <h4 className="user-prof-summary-head">
                  About Me info hasn't been added
                </h4>
                <span className="user-prof-summary">
                  {profile?.fname} {profile?.lname} hasn't had <br />a chance to
                  fill this out yet.
                </span>
              </div>
              {/* )} */}
            </div>

            <div className="col-md-5 col-sm-5 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 prof-info-boxes-fill">
                <div id="map">
                  <MapContainer
                    style={{height: '300px', width: '100%'}}
                    zoom={9}
                    zoomControl={false}
                    center={coordinates}
                  >
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </MapContainer>
                </div>
                <h5>
                  <b>Location</b>
                </h5>
              </div>
            </div>
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row p-2per">
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
            <div className="col-md-5 col-sm-5 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes-large">
                <h4 className="user-prof-summary-head">
                  No friends have been added
                </h4>
                <span className="user-prof-summary">
                  {profile?.fname} {profile?.lname} hasn't had <br />a chance to
                  add friends.
                </span>
              </div>
            </div>
            <div className="col-md-5 col-sm-5 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes-large">
                <h4 className="user-prof-summary-head">
                  User is hiding their events
                </h4>
                <span className="user-prof-summary">
                  {profile.fname} {profile.lname} is hiding <br />
                  events.
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default requireAuth(PersonalProfile);
