import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import contactOnline from '../../assets/img/contact-online.png';
import contactIdle from '../../assets/img/contact-idle.png';

const Friend = () => {
  const [myFriends, setMyFriends] = useState({ total: 0, friends: [] });

  const profile = () => {}

  return (
    <div className="container-fluid">
      <div className="row user-prof-name-pad">
        <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
        <div className="col-md-10 col-sm-10 col-xs-12" style={{ padding: '0px !important' }}>
          <div className="user-event-box mrgnbym80">
            <h4 className="event-frnds-heading">
              My Friends<span className="abt-me-frnds-grey">({myFriends.total})</span>
            </h4>
            <div className="events-wrap-frnds friends-list">
              {myFriends.friends.map((myFriend, index) => (<div key={index} className="col-md-2 col-sm-2 col-xs-4">
                <div className="frnds-photo-inner">
                  <div className="frnds-face-photo-div">
                    {/* <img src={US.getProfilePic(myFriend.profile_pic)} className="frnds-face-photo-img"
                      uib-popover-template="'../myFriendPopup.html'" popover-hoverable="true"
                      friendId="{{myFriend._id}}" popover-is-open="popoverOpened1.$open"
                      popover-append-to-body="true" /> */}
                  </div>
                  <div className="frnds-status-info-div">
                    {myFriend.is_online && <img src={contactOnline} className="frnds-status-img" alt="friend" />}
                    {!myFriend.is_online && <img src={contactIdle} className="frnds-status-img" alt="friend" />}
                  </div>
                </div>
                <Link to={profile({USER_ID: myFriend._id})}>
                  <h4 className="frnds-name">{myFriend.fname} {myFriend.lname}</h4>
                </Link>
              </div>))}
            </div>
          </div>
        </div>
        <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
      </div>
    </div>
  )
}

export default Friend
