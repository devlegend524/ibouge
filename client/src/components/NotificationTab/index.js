import React from 'react';
import { useFormik } from 'formik';
import { CheckBoxControl } from '../Inputs';

import './styles.scss';

const checkBoxArrary = [
  {
    desc: "New Messages",
    name: "new_messages"
  },
  {
    desc: "New Events",
    name: "new_events"
  },
  {
    desc: "Friend Requests",
    name: "friend_requests"
  },
  {
    desc: "Invitations to Conversation",
    name: "invitations_to_conversation"
  }
];

const NotificationTab = () => {
  const formik = useFormik({
    initialValues: {
      new_messages: false,
      new_events: false,
      friend_requests: false,
      invitations_to_conversation: false,
    }
  });

  const updateNotifications = () => {}

  return (
    <>
      <h3 className="tab-Head-Txts">Notifications</h3>
      <form className="tabs-notify-checkbox-frm-pad">
        {checkBoxArrary.map((item, index) => (<CheckBoxControl desc={item.desc} name={item.name} handle={formik} key={index} />))}

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
}

export default NotificationTab;
