import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Navbar from '../../components/Navbar';
import requireAuth from '../../hoc/requireAuth';

import ProfileTab from '../../components/ProfileTab';
import AccountTab from '../../components/AccountTab';
import PrivacyTab from '../../components/PrivacyTab';
import NotificationTab from '../../components/NotificationTab';
import Footer from '../../components/Footer';
import ImageCropper from '../../components/ImageCropper';
import {setProfilePic} from '../../actions/authActions';

import uploadPhoto from '../../assets/img/upload-photo.png';
import uploadPhotoPurple from '../../assets/img/upload-photo-icon-purple.png';
import './styles.scss';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const auth = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [newBlogImageUrl, setNewBlogImageUrl] = useState(
    auth.sess.profile_pic ? auth.sess.profile_pic : uploadPhoto
  );
  const dispatch = useDispatch();
  const changeProfilePic = () => {
    setOpen(true);
  };
  const handleChangePic = () => {
    var reqData = {
      userId: auth.sess._id,
      file: newBlogImageUrl,
      originalFile: newBlogImageUrl,
      albumName: 'all-profile-pictures',
    };
    console.log('change imgUrl', reqData);
    dispatch(setProfilePic(reqData));
  };
  const getMicroblogPic = (imgUrl) => {
    setNewBlogImageUrl(imgUrl);
  };

  return (
    <>
      <Navbar title="Profile-Setting" />
      <div className="profile">
        {auth.sess.account_type ? (
          <div
            className="container header-business"
            style={{
              backgroundImage: `url(${newBlogImageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
            }}
          >
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <h3 className="my-prof-sett-name text-center">Settings</h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="container header">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <h3 className="my-prof-sett-name text-center">Settings</h3>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <div className="row" style={{padding: '2%'}}>
            <div className="col-md-1 col-sm-1 col-xs-12 hidden-xs"></div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 my-prof-sett-box-style colPadZero">
                <div className="my-prof-img-box-photo my-prof-img-box">
                  <div className="my-prof-img-box-inner">
                    <div className="my-prof-img-box-photo-div">
                      <img
                        src={newBlogImageUrl}
                        className="my-prof-img-box-photo-img"
                        alt="box"
                      />
                    </div>
                    <div className="my-prof-img-box-info-div">
                      <a className="uploadProfImg">
                        <img
                          onClick={changeProfilePic}
                          src={uploadPhotoPurple}
                          className="my-prof-img-box-info-img"
                          alt="photo"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="my-sett-tabs-style">
                  <ul className="nav nav-pills nav-stacked" role="tablist">
                    <li
                      className={activeTab === 'profile' ? 'active' : ''}
                      onClick={() => setActiveTab('profile')}
                      aria-hidden="true"
                    >
                      <a>Profile</a>
                    </li>
                    <li
                      className={activeTab === 'account' ? 'active' : ''}
                      onClick={() => setActiveTab('account')}
                      aria-hidden="true"
                    >
                      <a>Account</a>
                    </li>
                    <li
                      className={activeTab === 'privacy' ? 'active' : ''}
                      onClick={() => setActiveTab('privacy')}
                      aria-hidden="true"
                    >
                      <a>Privacy</a>
                    </li>
                    <li
                      className={activeTab === 'notification' ? 'active' : ''}
                      onClick={() => setActiveTab('notification')}
                      aria-hidden="true"
                    >
                      <a>Notifications</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12 hidden-xs my-prof-sett-tab-content-style">
              <div className="tab-content">
                <div
                  className={
                    activeTab === 'profile' ? 'tab-pane active' : 'tab-pane'
                  }
                >
                  <ProfileTab />
                </div>
                <div
                  className={
                    activeTab === 'account' ? 'tab-pane active' : 'tab-pane'
                  }
                >
                  <AccountTab />
                </div>
                <div
                  className={
                    activeTab === 'privacy' ? 'tab-pane active' : 'tab-pane'
                  }
                >
                  <PrivacyTab />
                </div>
                <div
                  className={
                    activeTab === 'notification'
                      ? 'tab-pane active'
                      : 'tab-pane'
                  }
                >
                  <NotificationTab />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ImageCropper
        open={open}
        setOpen={setOpen}
        setImageUrl={getMicroblogPic}
        handleChangePic={handleChangePic}
      />
    </>
  );
};

export default requireAuth(Profile);
