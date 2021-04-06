import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setProfile  } from '../../actions/registerActions'

import './styles.scss'; 
import profile_default_img from '../../assets/img/upload-photo.png'
import upload_btn_img from '../../assets/img/upload-photo-icon.png'

const StepTwe = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const register = useSelector(state => state.register);
  const defaultType = useSelector(state => state.register.account_type)
  const [profile_info, setProfileInfo] = useState(register.profile?.about_me);
  const [profile_interest, setProfileInterest] = useState(register.profile?.interests);
  const [profile_language, setProfileLanguage] = useState(register.profile?.languages);
  const [company_website, setCompanyWebsite] = useState(register.profile?.website?register.profile?.website: ""  );
  const [phone_number, setPhoneNumber] = useState(register.profile?.phone?register.profile?.phone: "");
  const changeProfilePic = () => {
  }
  const handlePrevClick = () => {
    history.push('/profile_setup/step1')
  }
  const handleNextClick = () => {
    let profileData;
    if (defaultType === '0') {
      profileData = {
        "profile": {
          about_me: profile_info,
          interests: profile_interest,
          languages: profile_language
        }
      }
    } else {
      profileData = {
        "profile": {
          about_me: profile_info,
          website: company_website,
          phone: phone_number
        }
      }
    }
    dispatch(setProfile(profileData));
    history.push('/profile_setup/step3')
  }
  return (
    <div className="row">
      <div className="col-md-3 col-sm-3 col-12 text-center d-block d-sm-none"></div>
      <div className="col-md-6 col-sm-6 col-12">
        <span className="login-greeting">2/4 Setup your profile</span>
        <form action="profile_setup_step_two.html">
          {defaultType === '0'? (
          <div className="col-md-12 col-sm-12 col-12 text-center prof-info-box colPadZero">
            <div className="col-md-4 col-sm-4 col-12 prof-info-box-photo">
              <div className="prof-info-box-photo-inner">
                <div className="prof-info-box-photo-div">
                  <img src={ profile_default_img } className="prof-info-box-photo-img" alt="pho" />
                </div>
                <div className="prof-info-box-info-div">
                  <a href="" className="uploadProfImg">
                    <img onClick={() => changeProfilePic()}
                      src={ upload_btn_img } className="prof-info-box-info-img" alt="UPLD" />
                  </a>
                </div>
              </div>
              <h4 className="prof-name">{register?.user?.fname}. {register?.user?.lname}</h4>

            </div>
            <div className="col-md-8 col-sm-8 col-12 prof-info-box-info">
              <h4 className="prof-info"> About me <i className="fa fa-pencil-square-o prof-info-edit-icon"
                  aria-hidden="true"></i></h4>
              <textarea 
                className="form-control prof-info-text" 
                rows="7"
                placeholder="Tell us a little bit about yourself"></textarea>
            </div>
          </div> ) :
          (
            <>
              <div className="col-md-12 col-sm-12 col-12">
                <div className="prof-info-box-photo-inner">
                  <div className="prof-info-box-photo-div">
                    <img src={ profile_default_img } className="prof-info-box-photo-img w-70" alt="pho" />
                  </div>
                  <div className="prof-info-box-info-div">
                    <a href="" className="uploadProfImg">
                      <img onClick={() => changeProfilePic()}
                        src={ upload_btn_img } className="prof-info-box-info-img w-30" alt="upload_img" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-12 prof-info-box-photo">
                <h4 className="prof-name">{register?.user?.fname}. {register?.user?.lname}</h4>
              </div>
              <div className="col-md-12 col-sm-12 col-12 prof-info-box-info">
                <h4 className="prof-info">Company Summary <i className="fa fa-pencil-square-o prof-info-edit-icon"
                    aria-hidden="true"></i></h4>
                <textarea 
                  className="form-control prof-info-text" 
                  rows="7"
                  placeholder="Tell us a little bit about yourself"
                  onChange={e => setProfileInfo(e.target.value)}
                  value={ profile_info }
                />
              </div>
            </>
          )}
          {defaultType === '0'? (
            <>
              <div className="col-md-12 col-sm-12 col-xs-12" style={{  padding: '0px' }}>
                <div className="form-group form-spacing" style={{ margin: '0px', marginRight: '5px' }}>
                  <label htmlFor="exampleInputEmail1">My Interests</label>
                  <textarea 
                    className="form-control" 
                    rows="5"
                    placeholder="eg: Traveling"
                    value={ profile_interest }
                    onChange={e => setProfileInterest(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12" style={{ padding: '0px' }}>
                <div className="form-group form-spacing" style={{ margin: '0px' }} >
                  <label htmlFor="exampleInputEmail1">My Languages</label>
                  <textarea 
                    rows="5" 
                    className="form-control"
                    placeholder="eg: English" 
                    value={ profile_language }
                    onChange={e => setProfileLanguage(e.target.value)}
                  />
                </div>
              </div>
            </>
          ): (
            <>
              <div className="col-md-12 col-sm-12 col-xs-12" style={{  padding: '0px' }}>
                <div className="form-group form-spacing" style={{ margin: '0px', marginRight: '5px' }}>
                  <label htmlFor="exampleInputEmail1">Company Website</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="eg: https://www.mycompany.com" 
                    value={ company_website }
                    onChange={ e => setCompanyWebsite(e.target.value) }
                  />
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12" style={{ padding: '0px' }}>
                <div className="form-group form-spacing" style={{ margin: '0px' }} >
                  <label htmlFor="exampleInputEmail1">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="eg: +134344323"
                    value={ phone_number }
                    onChange={ e => setPhoneNumber(e.target.value) }  
                  />
                </div>
              </div>
            </>
          )}
          <div className="row">
            <div className="col-md-6 col-sm-6 col-12">
              <button type="button" onClick={() => handlePrevClick()} className="btn btn-default profinfo-submit-btn"
            style={{ width: '100%' }}>BACK</button>
            </div>
            <div className="col-md-6 col-sm-6 col-12">
              <button type="button" onClick={() => handleNextClick()} className="btn btn-primary profinfo-submit-btn"
            style={{ width: '100%' }}>NEXT</button>
            </div>
          </div>
        </form>
      </div>
      <div className="col-md-3 col-sm-3 col-12 text-center d-block d-sm-none"></div>
    </div>
  )
}

export default StepTwe
