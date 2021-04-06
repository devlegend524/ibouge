import React from 'react';
import { useFormik } from 'formik';
import { CheckBoxControl } from '../Inputs';
import EventIcon from '../../assets/img/event-icon.png';
import './styles.scss';

const checkBoxArrary = [
  {
    desc: "Only allow other members to see my profile",
    name: "only_members_see_profile"
  },
  {
    desc: "Share my recent events",
    name: "share_recent_events"
  },
  {
    desc: "Show my friends",
    name: "show_my_friends"
  },
  {
    desc: "Make my profile public",
    name: "is_profile_public"
  },
  {
    desc: "New messages",
    name: "new_messages"
  }
];

const PrivacyTab = () => {
  const updatePrivacy = () => {}

  const formik = useFormik({
    initialValues: {
      only_members_see_profile: false,
      share_recent_events: false,
      show_my_friends: false,
      is_profile_public: false,
      new_messages: false,
    }
  });

  return (
    <>
      <h3 className="tab-Head-Txts">Privacy</h3>
      <form className="tabs-notify-checkbox-frm-pad">
        {checkBoxArrary.map((item, index) => (<CheckBoxControl desc={item.desc} name={item.name} handle={formik} key={index} />))}
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
}

export default PrivacyTab;
