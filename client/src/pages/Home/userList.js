import React from 'react';
import {useHistory} from 'react-router-dom';
import {getInterests, getGenderAbbrev} from '../../helpers/utils';
import uploadPhoto from '../../assets/img/upload-photo.png';
import contactOnline from '../../assets/img/contact-online.png';
import contactIdle from '../../assets/img/contact-idle.png';
const UserList = (props) => {
  const history = useHistory();
  const view_profile = (userId) => {
    history.push(`profile/${userId}`);
  };

  return (
    <>
      <h2 className="amount-of-microblogs">{props.data?.length} Users</h2>
      {props.data &&
        props.data.map((user, k) => (
          <div
            className="events-wrap-view"
            onClick={(e) => view_profile(user.properties.user_id)}
            style={{cursor: 'pointer'}}
            key={k}
          >
            <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
              <img
                src={user.profile_pic ? user.profile_pic : uploadPhoto}
                className="img-of-creator"
                alt="creator"
              />
              <div className="frnds-status-info-div">
                {user.online ? (
                  <img
                    src={contactOnline}
                    style={{width: '40%', borderRadius: '50%'}}
                    alt="online"
                  />
                ) : (
                  <img
                    src={contactIdle}
                    style={{width: '40%', borderRadius: '50%'}}
                    alt="offline"
                  />
                )}
              </div>
            </div>
            <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
              <div className="name-of-microblog">
                <span>
                  {user.properties.fname} {user.properties.lname}
                </span>
              </div>
              <div className="amount-of-users">
                <span ng-style="{ 'color': '#1E90FF' }">
                  {getGenderAbbrev(user.properties.gender)}
                  {user.dateOfEvent ? user.properties.dateOfEvent : ''} -
                </span>
                {getInterests(user.properties.interests)}
              </div>
            </div>
            <div className="col-md-2 col-sm-2 col-xs-2 colPadZero microblog-seperator-border"></div>
            <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
              <a className="microblog-arrow-view">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        ))}
    </>
  );
};

export default UserList;
