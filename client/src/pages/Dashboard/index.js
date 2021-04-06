import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import _ from 'lodash';
import Navbar from '../../components/Navbar';
import Feed from './feed';
import Map from './map';
import Event from './event';
import Friend from './friend';
import Footer from './footer';
import { setTitle }  from '../../actions/commonAction'

import './styles.scss';

const Dashboard = () => {
  const [myFriends, setMyFriends] = useState({ total: 0, friends: [] });

  const selectedFriends = _.filter(myFriends.friends, { selected: true });

  const startConversation = (selectedFriends) => {}
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(setTitle('Dashboard'))
    }, []);
  return (
    <>
      <Navbar />
      <section className="content-area">
        <div className="container containerWidth">
          <div className="row user-prof-name-pad">
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
            <div className="col-md-6 col-sm-6 col-xs-12 hidden-xs">
              <Feed />
            </div>

            <div className="col-md-4 col-sm-4 col-xs-12">
              <Map />
            </div>

            <div className="col-md-4 col-sm-4 col-xs-12 offset-md-1">
              <Event />
            </div>
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
          </div>

        <Friend />
        </div>
      </section>

      <div className="chat-btm-select-contacts">
        <div className="col-md-12 col-sm-12 col-xs-12 padding-even">
          {myFriends.friends.map((myFriend, index) => (<div key={index} className="frnds-selected-div ibg-overlay-container" style={{ position: 'relative' }}>
            {/* <img src={US.getProfilePic(myFriend.profile_pic)} className="frnds-selected-img ibg-overlay-item" /> */}
            <div className="ibg-overlay">
              <span
                style={{ fontSize: '20px', cursor: 'pointer' }}
                onClick={() => { myFriend.selected = false; }}
                aria-hidden="true"
              >
                <i className="fa fa-close"></i>
              </span>
            </div>
          </div>))}
          <span className="frnds-select-count">{selectedFriends.length} Friends Selected</span>
          <div className="btn-submit-position">
            <button type="button" className="btn btn-primary chat-invite-purple-btn margin-btn">CANCEL</button>
            <button
              type="button"
              className="btn btn-primary chat-invite-orange-btn margin-btn"
              onClick={() => startConversation(selectedFriends)}
            >
              START CONVERSATION
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Dashboard
