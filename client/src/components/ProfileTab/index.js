import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import './styles.scss';

const ProfileTab = () => {

  const [profile_info, setProfileInfo] = useState('');
  const [interests, setInterests] = useState('');
  const [languages, setLanguages] = useState('');
  
  return (
    <>
      <h3 className="tab-Head-Txts">My Profile</h3>
      <form>
        <div className="tab-prof-sett-white-box">
          <h4 className="prof-info">
            About me <i className="fa fa-pencil-square-o prof-info-edit-icon"></i>
          </h4>
          {/* <p className="fadeOut" style={{ fontSize: 'large', color: '#f8a454' }}>
            Please fill out a brief description about yourself.
          </p> */}
          <textarea
            className="form-control prof-info-text tab-txtarea-style"
            rows="5"
            placeholder="How would your best friend describe you?"
            onChange={e => setProfileInfo(e.target.value)}
          >
            {profile_info}
            </textarea>
        </div>
        <div className="form-group form-spacing">
          <label htmlFor="exampleInputEmail1" className="tab-inputarea-txt-style">
            My Interests - Please add an interest and press enter/return
          </label>
          <input
            type="text"
            className="form-control tab-inputarea-style"
            id="exampleInput1"
            placeholder="eg: Music"
            value={interests}
            onChange={e => setInterests(e.target.value)}
          />
          {/* <p className="fadeOut" style={{ fontSize: 'large', margin: '7px', color: '#f8a454' }}>
            Please press enter/return after typing each interest.
          </p>
          <p className="fadeOut"
            style={{ fontSize: 'large', margin: '7px', color: '#07d326' }}>
            You can add more than one if you'd like.
          </p> */}
        </div>
        {/* <div className="interests-wrap">
          <div className="interests-chip" ng-repeat="interest in myProfileSettings.profile.interests">
            {{interest}}<a
              ng-click="removeItem(interest, myProfileSettings.profile.interests)"><i
                className="fa fa-remove interestsIcon"></i></a>
          </div>
        </div> */}
        <div className="form-group form-spacing">
          <label htmlFor="exampleInputEmail1" className="tab-inputarea-txt-style">
            My Languages - Please add a language and press enter/return
          </label>
          <input
            id="exampleInputEmail1"
            type="text"
            className="form-control tab-inputarea-style"
            placeholder="eg: French"
            value={languages}
            onChange={e => setLanguages(e.target.value)}
          />
          {/* <p className="fadeOut" style={{ fontSize: 'large', margin: '7px', color: '#f8a954' }}>
            Please press enter/return after typing each language.
          </p>
          <p className="fadeOut" style={{ fontSize: 'large', margin: '7px', color: '#07d326' }}>
            You can add more than one if you'd like.
          </p> */}
        </div>
        {/* <div className="interests-wrap">
          <div className="interests-chip" ng-repeat="language in myProfileSettings.profile.languages">
            {{language}}<a
              ng-click="removeItem(language, myProfileSettings.profile.languages)"><i
                className="fa fa-remove interestsIcon"></i></a>
          </div>
        </div> */}
        {/* <p className="fadeOut"
          style={{ margin: '7px', color: '#07d326', fontSize: 'x-large' }}>
          Updated Successfully!
        </p>
        <p className="fadeOut"
          style={{ margin: '7px', color: '#f8a954', fontSize: 'x-large' }}>
          Update Unsuccessful. Please fill in all fields.
        </p> */}
        <div className="profile action-container">
          <button
            type="button"
            className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
          >
            Save
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

export default ProfileTab;
