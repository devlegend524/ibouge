import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {setProfile} from '../../actions/registerActions';
import EventIcon from '../../assets/img/event-icon.png';
import './styles.scss';

const PrivacyTab = () => {
  const auth = useSelector((state) => state.auth.sess);
  const dispatch = useDispatch();
  const [member_see, setMemberSee] = useState(
    auth.privacy.only_members_see_profile
  );
  const [shareEvent, setShareEvent] = useState(
    auth.privacy.share_recent_events
  );
  const [showFriend, setShowFriend] = useState(auth.privacy.show_my_friends);
  const [profilePublic, setProfilePublic] = useState(
    auth.privacy.is_profile_public
  );
  const [newMessages, setNewMessages] = useState(auth.privacy.new_messages);
  const [blockList, setBlockList] = useState(auth.privacy.block_list);

  const handleChange = (type) => {
    if (type === 'only_members_see_profile') {
      setMemberSee(!member_see);
    }
    if (type === 'share_recent_events') {
      setShareEvent(!shareEvent);
    }
    if (type === 'show_my_friends') {
      setShowFriend(!showFriend);
    }
    if (type === 'is_profile_public') {
      setProfilePublic(!profilePublic);
    }
    if (type === 'new_messages') {
      setNewMessages(!newMessages);
    }
    if (type === 'block_list') {
      setBlockList(!blockList);
    }
  };
  const updatePrivacy = () => {
    console.log('submit button clicked...');
    const data = {
      privacy: {
        only_members_see_profile: member_see,
        share_recent_events: shareEvent,
        show_my_friends: showFriend,
        is_profile_public: profilePublic,
        new_messages: newMessages,
        block_list: blockList,
      },
    };
    dispatch(setProfile(data));
  };

  return (
    <>
      <h3 className="tab-Head-Txts">Privacy</h3>
      <form className="tabs-notify-checkbox-frm-pad">
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">
            Only allow other members to see my profile
          </span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('only_members_see_profile')}
              checked={member_see ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">
            Share my recent events
          </span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('share_recent_events')}
              checked={shareEvent ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">Show my friends</span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('show_my_friends')}
              checked={showFriend ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">
            Make my profile public
          </span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('is_profile_public')}
              checked={profilePublic ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">New messages</span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('new_messages')}
              checked={newMessages ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
      </form>

      <h3 className="tab-Head-Txts">Block List</h3>
      <form className="tabs-notify-checkbox-frm-pad">
        <div className="events-wrap-converse" ng-repeat="user in blockList">
          <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
            <img src={EventIcon} className="events-convers-img" alt="cover" />
          </div>
          <div className="col-md-9 col-sm-9 col-xs-7 colPadZero event-seperator-border">
            {/* <div className="event-heading-convers">
              <span>{{user.fname}} {{user.lname}}</span>
            </div> */}
            <div className="event-sub-heading-convers">
              <span>San Francisco, CA</span>
            </div>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
            <button
              type="submit"
              className="btn btn-primary chat-invite-purple-btn tabs-notify-sett-align-pad"
            >
              REMOVE
            </button>
          </div>
        </div>
        <div className="privacy action-container">
          <button
            type="button"
            onClick={updatePrivacy}
            className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
          >
            SAVE
          </button>
          <button
            type="button"
            className="btn btn-primary chat-invite-purple-btn margin-btn"
          >
            CANCEL
          </button>
        </div>
      </form>
    </>
  );
};

export default PrivacyTab;
