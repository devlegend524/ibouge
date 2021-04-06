import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import requireAuth from "../../hoc/requireAuth";

import { setTitle } from "../../actions/commonAction";
import { getUserProfile } from "../../actions/userActions";

import MapGL from "react-map-gl";

import { MAPBOX_TOKEN } from "../../constants";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./styles.scss";

import uploadPhoto from "../../assets/img/upload-photo.png";
import abtMeIcon1 from "../../assets/img/abt-me-icon1.png";
import abtMeIcon2 from "../../assets/img/abt-me-icon2.png";
const navControlStyle = {
  right: 10,
  bottom: 50,
};
const getControlStyle = {
  right: 10,
  bottom: 10,
};
const PersonalProfile = () => {
  const param = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("My-Profile"));
    dispatch(getUserProfile(param.id));
  }, []);
  const profileState = useSelector((state) => state.users.profile);
  const [profile] = useState(profileState);
  const [viewport] = useState({
    latitude: profile.location.coordinates[0],
    longitude: profile.location.coordinates[1],
    zoom: 12,
  });
  return (
    <>
      <Navbar />
      <section>
        <div className="container-fluid" id="container-fluid">
          <div className="">
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
            <div className="col-md-5 col-sm-5 col-xs-12 pb-20">
              <div className="col-md-12 col-sm-12 col-xs-12 text-left colPadZero">
                <div className="col-md-5 col-sm-5 col-xs-12 ">
                  <img
                    src={uploadPhoto}
                    className="userprof-img-large"
                    alt="photo"
                  />
                </div>
                <div className="col-md-7 col-sm-7 col-xs-12 user-prof-name-pad hidden-xs">
                  <h3 className="user-prof-name">
                    {profile.fname} {profile.lname}
                  </h3>
                </div>
                <div className="col-md-7 col-sm-7 col-xs-12 user-prof-name-pad visible-xs">
                  <h3 className="xs-h3">
                    {profile.fname} {profile.lname}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-sm-5 col-xs-12"></div>
          </div>
          <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
        </div>
        <div className="container-fluid">
          <div className="row p-2per">
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
            <div className="col-md-5 col-sm-5 col-xs-12">
              {profile.profile.about_me.trim() && (
                <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes">
                  <h4 className="user-prof-summary-head">
                    No summary has been added
                  </h4>
                  <span className="user-prof-summary">
                    {profile.fname} {profile.lname} hasn't had <br />a chance to
                    add a summary.
                  </span>
                </div>
              )}
              {profile.profile.about_me.trim() && (
                <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes">
                  <h4 className="user-prof-summary-head">
                    About Me info hasn't been added
                  </h4>
                  <span className="user-prof-summary">
                    {profile.fname} {profile.lname} hasn't had <br />a chance to
                    fill this out yet.
                  </span>
                </div>
              )}
            </div>

            <div className="col-md-5 col-sm-5 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 prof-info-boxes-fill">
                <div id="map">
                  <MapGL
                    {...viewport}
                    width="100%"
                    height="100%"
                    mapStyle="https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB"
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  ></MapGL>
                </div>
                <h5>
                  <b>Location</b>
                </h5>
              </div>
            </div>
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row p-2per">
            <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
            <div className="col-md-5 col-sm-5 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes-large">
                <h4 className="user-prof-summary-head">
                  No friends have been added
                </h4>
                <span className="user-prof-summary">
                  {profile.fname} {profile.lname} hasn't had <br />a chance to
                  add friends.
                </span>
              </div>
            </div>
            <div className="col-md-5 col-sm-5 col-xs-12">
              <div className="col-md-12 col-sm-12 col-xs-12 text-center prof-info-boxes-large">
                <h4 className="user-prof-summary-head">
                  User is hiding their events
                </h4>
                <span className="user-prof-summary">
                  {profile.fname} {profile.lname} is hiding <br />
                  events.
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-sm-1 col-xs-12 text-center hidden-xs"></div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default requireAuth(PersonalProfile);
