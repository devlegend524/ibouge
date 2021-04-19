import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {setProfile} from '../../actions/registerActions';

import './styles.scss';

const NotificationTab = () => {
  const auth = useSelector((state) => state.auth.sess);
  const dispatch = useDispatch();
  const [notification_event, setNotificationEvent] = useState(
    auth.notifications.new_events
  );
  const [notification_message, setNotificationMessage] = useState(
    auth.notifications.new_messages
  );
  const [notification_friend_request, setNotificationFriendRequest] = useState(
    auth.notifications.friend_requests
  );
  const [notification_invite_chat, setNotificationInviteChat] = useState(
    auth.notifications.invitations_to_conversation
  );
  const handleChange = (type) => {
    if (type === 'new_events') {
      setNotificationEvent(!notification_event);
    }
    if (type === 'new_messages') {
      setNotificationMessage(!notification_message);
    }
    if (type === 'friend_requests') {
      setNotificationFriendRequest(!notification_friend_request);
    }
    if (type === 'invitations_to_conversation') {
      setNotificationInviteChat(!notification_invite_chat);
    }
  };
  const updateNotifications = () => {
    console.log('submit button clicked...');
    const data = {
      notifications: {
        new_messages: notification_message,
        new_events: notification_event,
        friend_requests: notification_friend_request,
        invitations_to_conversation: notification_invite_chat,
      },
    };
    dispatch(setProfile(data));
  };

  return (
    <>
      <h3 className="tab-Head-Txts">Notifications</h3>
      <form className="tabs-notify-checkbox-frm-pad">
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">New Messages</span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('new_messages')}
              checked={notification_message ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">New Events</span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('new_events')}
              checked={notification_event ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>

        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">Friend Requests</span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('friend_requests')}
              checked={notification_friend_request ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="tabs-notify-check-styles">
          <span className="tabs-notify-check-span-toggle">
            Invitations to Conversation
          </span>
          <label className="switch tabs-notify-checkbox-align-toggle">
            <input
              type="checkbox"
              onChange={(e) => handleChange('invitations_to_conversation')}
              checked={notification_invite_chat ? 'checked' : ''}
            />
            <div className="slider round"></div>
          </label>
        </div>
        <div className="notification action-container">
          <button
            type="button"
            onClick={updateNotifications}
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

export default NotificationTab;
