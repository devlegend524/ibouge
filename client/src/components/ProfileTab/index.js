import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setProfile} from '../../actions/registerActions';

import './styles.scss';

const ProfileTab = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [profile_info, setProfileInfo] = useState(
    auth.sess?.about_me ? auth.sess?.about_me : ''
  );
  const [interests, setInterests] = useState(
    auth.sess?.interests ? auth.sess?.interests : ''
  );
  const [languages, setLanguages] = useState(
    auth.sess?.languages ? auth.sess?.languages : ''
  );
  const [website, setCompanyWebsite] = useState(
    auth.sess?.website ? auth.sess?.website : ''
  );
  const [phone, setPhoneNumber] = useState(
    auth.sess?.phone ? auth.sess?.phone : ''
  );
  const handleNextClick = () => {
    let profileData;
    if (auth.sess.acount_type === '0') {
      profileData = {
        profile: {
          about_me: profile_info,
          interests: interests,
          languages: languages,
        },
      };
    } else {
      profileData = {
        profile: {
          about_me: profile_info,
          website: website,
          phone: phone,
        },
      };
    }
    dispatch(setProfile(profileData));
  };
  return (
    <>
      {auth.sess.account_type === '1' ? (
        <>
          <h3 className="tab-Head-Txts">My Profile</h3>
          <form>
            <div className="tab-prof-sett-white-box">
              <h4 className="prof-info">
                About me{' '}
                <i className="fa fa-pencil-square-o prof-info-edit-icon"></i>
              </h4>
              {/* <p className="fadeOut" style={{ fontSize: 'large', color: '#f8a454' }}>
            Please fill out a brief description about yourself.
          </p> */}
              <textarea
                className="form-control prof-info-text tab-txtarea-style"
                rows="5"
                placeholder="How would your best friend describe you?"
                onChange={(e) => setProfileInfo(e.target.value)}
                value={profile_info}
              />
            </div>
            <div className="form-group form-spacing">
              <label
                htmlFor="exampleInputEmail1"
                className="tab-inputarea-txt-style"
              >
                My Interests - Please add an interest and press enter/return
              </label>
              <input
                type="text"
                className="form-control tab-inputarea-style"
                id="exampleInput1"
                placeholder="eg: Music"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            <div className="form-group form-spacing">
              <label
                htmlFor="exampleInputEmail1"
                className="tab-inputarea-txt-style"
              >
                My Languages - Please add a language and press enter/return
              </label>
              <input
                id="exampleInputEmail1"
                type="text"
                className="form-control tab-inputarea-style"
                placeholder="eg: French"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
              />
            </div>
            <div className="profile action-container">
              <button
                type="button"
                className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
                onClick={handleNextClick}
              >
                Save
              </button>
              <button
                type="reset"
                className="btn btn-primary chat-invite-purple-btn margin-btn"
              >
                CANCEL
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h3 className="tab-Head-Txts">Business Profile</h3>
          <form>
            <div className="col-md-12 col-sm-12 col-12 text-center prof-info-box colPadZero">
              <div className="col-md-12 col-sm-12 col-12 prof-info-box-info">
                <div
                  className="form-group form-spacing"
                  style={{margin: '0px', marginRight: '5px'}}
                >
                  <label htmlFor="exampleInputEmail1">Company Website</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="eg: https://www.mycompany.com"
                    value={website}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>
                <div
                  className="form-group form-spacing"
                  style={{margin: '0px'}}
                >
                  <label htmlFor="exampleInputEmail1">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="eg: +134344323"
                    value={phone}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <h4 className="prof-info">
                  Company Summary{' '}
                  <i
                    className="fa fa-pencil-square-o prof-info-edit-icon"
                    aria-hidden="true"
                  ></i>
                </h4>
                <textarea
                  className="form-control prof-info-text"
                  rows="7"
                  placeholder="Tell us a little bit about yourself"
                  onChange={(e) => setProfileInfo(e.target.value)}
                  value={profile_info}
                />
              </div>
            </div>
            <div className="profile action-container">
              <button
                type="button"
                className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
                onClick={handleNextClick}
              >
                Save
              </button>
              <button
                type="reset"
                className="btn btn-primary chat-invite-purple-btn margin-btn"
              >
                CANCEL
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default ProfileTab;
