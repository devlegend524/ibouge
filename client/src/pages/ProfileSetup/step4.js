import React, { useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import MapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { setProfile } from "../../actions/registerActions";

import { MAPBOX_TOKEN } from "../../constants";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./styles.scss";

const mapStyle =
  "https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB";

const StepFour = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [extraCityToFollow0, setFirstExtraCity] = useState({});
  const [extraCityToFollow1, setSecondExtraCity] = useState({});
  const [extraCityToFollow2, setThirdExtraCity] = useState({});
  const [viewport1, setViewport1] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });
  const [viewport2, setViewport2] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });
  const [viewport3, setViewport3] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });
  const mapRef1 = useRef();
  const mapRef2 = useRef();
  const mapRef3 = useRef();
  const handleViewportChange1 = useCallback((newViewport) => {
    setViewport1(newViewport);
  }, []);

  const handleGeocoderViewportChange1 = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    const reverseGeocodingURL =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      newViewport.longitude +
      "," +
      newViewport.latitude +
      `.json?access_token=${MAPBOX_TOKEN}`;
    axios.get(reverseGeocodingURL).then(function (response) {
      console.log(response);
      setFirstExtraCity({
        cityName: response.data.features[0].context[2].text,
        bbox: [],
        center: response.data.features[0].center,
      });
    });
    return handleViewportChange1({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  const handleViewportChange2 = useCallback((newViewport) => {
    setViewport2(newViewport);
  }, []);

  const handleGeocoderViewportChange2 = useCallback((newViewport) => {
    const reverseGeocodingURL =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      newViewport.longitude +
      "," +
      newViewport.latitude +
      `.json?access_token=${MAPBOX_TOKEN}`;
    axios.get(reverseGeocodingURL).then(function (response) {
      setSecondExtraCity({
        cityName: response.data.features[0].context[2].text,
        bbox: [],
        center: response.data.features[0].center,
      });
    });
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return handleViewportChange2({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  const handleViewportChange3 = useCallback((newViewport) => {
    setViewport3(newViewport);
  }, []);

  const handleGeocoderViewportChange3 = useCallback((newViewport) => {
    const reverseGeocodingURL =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      newViewport.longitude +
      "," +
      newViewport.latitude +
      `.json?access_token=${MAPBOX_TOKEN}`;
    axios.get(reverseGeocodingURL).then(function (response) {
      setThirdExtraCity({
        cityName: response.data.features[0].context[2].text,
        bbox: [],
        center: response.data.features[0].center,
      });
    });
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return handleViewportChange3({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  const handleClick = () => {
    dispatch(
      setProfile({
        location: {
          extraCityToFollow0: extraCityToFollow0,
          extraCityToFollow1: extraCityToFollow1,
          extraCityToFollow2: extraCityToFollow2,
        },
      })
    );
    history.push("/");
  };
  const handlePrevClick = () => {
    history.push("/profile_setup/step3");
  };
  return (
    <div className="container containerWidth">
      <div className="row">
        <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
        <div className="col-md-10 col-sm-10 col-12 text-center">
          <span className="profile-set-head">4/4 Follow the location</span>
          <form>
            <div style={{ width: "100%" }}>
              <h4
                className="inner-subheadings-more"
                style={{ marginBottom: "30px" }}
              >
                {" "}
                Select 3 cities to follow
              </h4>
              <div className="col-md-4 col-sm-4 col-12">
                <div
                  id="followLocation1Map"
                  style={{ width: "100%", height: "100%" }}
                  className="hidden"
                ></div>
                <p
                  className="login-greeting-sub-head"
                  style={{ textAlign: "left !important" }}
                >
                  First City
                </p>
                <div id="followLocation1Search">
                  <MapGL
                    ref={mapRef1}
                    {...viewport1}
                    width="100%"
                    height="150px"
                    onViewportChange={handleViewportChange1}
                    mapStyle={mapStyle}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  >
                    <Geocoder
                      mapRef={mapRef1}
                      onViewportChange={handleGeocoderViewportChange1}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                      position="top-right"
                    />
                  </MapGL>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-12">
                <div
                  id="followLocation2Map"
                  style={{ width: "100%", height: "100%" }}
                  className="hidden"
                ></div>
                <p
                  className="login-greeting-sub-head mt-2"
                  style={{ textAlign: "left !important" }}
                >
                  Second City
                </p>
                <div id="followLocation2Search">
                  <MapGL
                    ref={mapRef2}
                    {...viewport2}
                    width="100%"
                    height="150px"
                    onViewportChange={handleViewportChange2}
                    mapStyle={mapStyle}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  >
                    <Geocoder
                      mapRef={mapRef2}
                      onViewportChange={handleGeocoderViewportChange2}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                      position="top-right"
                    />
                  </MapGL>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-12">
                <div
                  id="followLocation3Map"
                  style={{ width: "100%", height: "100%" }}
                  className="hidden"
                ></div>
                <p
                  className="login-greeting-sub-head mt-2"
                  style={{ textAlign: "left !important" }}
                >
                  Third City
                </p>
                <div id="followLocation3Search">
                  <MapGL
                    ref={mapRef3}
                    {...viewport3}
                    width="100%"
                    height="150px"
                    onViewportChange={handleViewportChange3}
                    mapStyle={mapStyle}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  >
                    <Geocoder
                      mapRef={mapRef3}
                      onViewportChange={handleGeocoderViewportChange3}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                      position="top-right"
                    />
                  </MapGL>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-1 col-sm-1 col-12"></div>
              <div className="col-md-4 col-sm-4 col-12">
                <button
                  type="button"
                  onClick={() => handlePrevClick()}
                  className="btn btn-default profinfo-submit-btn"
                  style={{ width: "100%" }}
                >
                  BACK
                </button>
              </div>
              <div className="col-md-1 col-sm-1 col-12"></div>
              <div className="col-md-5 col-sm-5 col-12">
                <button
                  type="button"
                  onClick={(e) => handleClick()}
                  className="btn btn-primary login-submit-btn"
                >
                  CREATE MY ACCOUNT!
                </button>
              </div>
              <div className="col-md-1 col-sm-1 col-12"></div>
            </div>
          </form>
        </div>
        <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
      </div>
    </div>
  );
};

export default StepFour;
