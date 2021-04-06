import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";

import MapGL, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl";

import {
  navControlStyle,
  getControlStyle,
  countiesLayer,
  highlightLayer,
} from "./map-style";

import Geocoder from "react-map-gl-geocoder";
import { MAPBOX_TOKEN } from "../../constants";

// load helper
import { getArrayOfGeoJSON } from "../../helpers/utils";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import MapCustom from './mapCustom';
import requireAuth from "../../hoc/requireAuth";
import { setTitle } from "../../actions/commonAction";
import { getAllMicroBlogs } from "../../actions/microblogAction";
import { getAllUsers } from "../../actions/userActions";
import { getAllEvents } from "../../actions/eventAction";

import online from "../../assets/img/contact-online.png";
import offline from "../../assets/img/contact-idle.png";
import upload_photo from "../../assets/img/upload-photo.png";
import "./styles.scss";

const Home = () => {
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const [viewState, setViewState] = useState("users");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Home"));
    dispatch(getAllMicroBlogs());
    dispatch(getAllUsers());
    dispatch(getAllEvents());
  }, []);
  const defaultUsersData = useSelector((state) => state.users);
  const [users] = useState(defaultUsersData.users);

  const [viewport, setViewport] = useState({
    latitude: auth.sess.location?.coordinates[0]
      ? auth.sess.location?.coordinates[0]
      : 37.7577,
    longitude: auth.sess.location?.coordinates[1]
      ? auth.sess.location?.coordinates[1]
      : -122.4376,
    zoom: 12,
  });
  const [geojson, setGeoJson] = useState({
    type: "FeatureCollection",
    features: getArrayOfGeoJSON(users),
  });
  const getCursor = ({ isHovering, isDragging }) => {
    return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
  };

  const mapRef = useRef();
  const handleViewportChange = useCallback((newViewport) => {
    if (newViewport.longitude > 0) {
      newViewport.longitude = 0;
    }
    setViewport(newViewport);
    // const usersOnMap = mapRef.current.queryRenderedFeatures();
    // if (usersOnMap) {
    //   const uniqueUsers = getUniqueIcons(usersOnMap);
    //   for (let i = 0; i < uniqueUsers.length; i++) {
    //     for (let j = 0; j < users.length; j++) {
    //       if (uniqueUsers[i].properties.user_id === users[j]._id) {
    //         finalUsers.push(users[j]);
    //         break;
    //       }
    //     }
    //   }
    // }
    // setGeoJson({
    //   type: "FeatureCollection",
    //   features: getArrayOfGeoJSON(finalUsers),
    // });
  }, []);

  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback((event) => {
    const user = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
      countyName: user && user.properties.description,
    });
  }, []);
  const onClick = useCallback((event) => {
    const user = event.features && event.features[0];
    history.push(`/profile/${user.properties.user_id}`);
  });
  const selectedCounty = (hoverInfo && hoverInfo.countyName) || "";
  const filter = useMemo(() => ["in", "user_icon", selectedCounty], [
    selectedCounty,
  ]);
  return (
    <>
      <Navbar />
      <div className="home-page">
        {!auth.isAuthenticated ? (
          <div>
            <p>
              Welcome guest!{" "}
              <Link className="bold" to="/login">
                Log in
              </Link>{" "}
              or{" "}
              <Link className="bold" to="/register">
                Register
              </Link>
            </p>
          </div>
        ) : (
          <div className="h-100 w-100">
            <div
              className="hidden-xs"
              style={{ width: "80%", height: "80%", marginTop: "58px" }}
            >
              <MapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="570px"
                onViewportChange={handleViewportChange}
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                onHover={onHover}
                onClick={onClick}
                interactiveLayerIds={["user_icon"]}
                mapStyle="https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB"
                mapboxApiAccessToken={MAPBOX_TOKEN}
              >
                <Geocoder
                  mapRef={mapRef}
                  onViewportChange={handleGeocoderViewportChange}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  position="top-right"
                />
                <Source id="usersIcons" type="geojson" data={geojson}>
                  <Layer {...countiesLayer} />
                  <Layer {...highlightLayer} filter={filter} />
                </Source>
                {selectedCounty && (
                  <Popup
                    longitude={hoverInfo.longitude}
                    latitude={hoverInfo.latitude}
                    closeButton={false}
                    className="county-info"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedCounty }}
                    ></div>
                  </Popup>
                )}
                {/* {markers} */}
                <NavigationControl style={navControlStyle} />
                <GeolocateControl style={getControlStyle} />
              </MapGL>
            </div>
            <div
              style={{ width: "100%", height: "66%", marginTop: "58px" }}
              className="visible-xs-block"
            >
              <MapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="400px"
                onViewportChange={handleViewportChange}
                onHover={onHover}
                interactiveLayerIds={["user_icon"]}
                mapStyle="https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB"
                mapboxApiAccessToken={MAPBOX_TOKEN}
              >
                <Geocoder
                  mapRef={mapRef}
                  onViewportChange={handleGeocoderViewportChange}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  position="top-right"
                />
                <Source id="usersIcons" type="geojson" data={geojson}>
                  <Layer {...countiesLayer} />
                  <Layer {...highlightLayer} filter={filter} />
                </Source>
                {selectedCounty && (
                  <Popup
                    longitude={hoverInfo.longitude}
                    latitude={hoverInfo.latitude}
                    closeButton={false}
                    className="county-info"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedCounty }}
                    ></div>
                  </Popup>
                )}
                {/* {markers} */}
                <NavigationControl style={navControlStyle} />
                <GeolocateControl style={getControlStyle} />
              </MapGL>
            </div>

            <div className="hidden-xs e-box">
              <h2 className="amount-of-microblogs">
                {viewState === "users" ? `Users ${users.length} ` : ""}
                {viewState === "events" ? "Events" : ""}
                {viewState === "blogs" ? "Microblogs" : ""}
              </h2>
              {users.map((user) => (
                <div
                  className="events-wrap-view"
                  key={user._id}
                  onClick={(e) => history.push(`/profile/${user._id}`)}
                >
                  <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                    <img
                      src={upload_photo}
                      className="img-of-creator"
                      alt="photo"
                    />
                    <div className="frnds-status-info-div">
                      <img
                        src={user.is_online ? online : offline}
                        style={{ width: "40%", borderRadius: "50%" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
                    <div className="name-of-microblog">
                      <span>
                        {user.fname} {user.lname}
                      </span>
                    </div>
                    <div className="amount-of-users">
                      <span ng-style="{ 'color': '#1E90FF' }">M -</span>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-2 colPadZero microblog-seperator-border"></div>
                  <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
                    <a className="microblog-arrow-view">
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="visible-xs-block">
              <h2
                className="amount-of-microblogs"
                style={{
                  backgroundColor: "#6148a1",
                  color: "white",
                }}
              >
                {viewState === "users" ? "Users" : ""}
                {viewState === "events" ? "Events" : ""}
                {viewState === "blogs" ? "Microblogs" : ""}
              </h2>
              <div className="events-wrap-view">
                <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                  <img className="img-of-creator" />
                </div>
                <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
                  <div className="name-of-microblog">
                    <span></span>
                  </div>
                  <div className="amount-of-users">
                    <a href="" className="microblog-box-users microblog-users">
                      <i className="fa fa-user" aria-hidden="true"></i>
                      <span></span>
                    </a>
                    <span></span>
                  </div>
                </div>
                <div className="col-md-2 col-sm-2 col-xs-2 colPadZero microblog-seperator-border"></div>
                <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
                  <a className="microblog-arrow-view">
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>

            <div id="floatMenu">
              <div className="float-btn">
                <div className="dropdown">
                  <a
                    className="btn float-btn-wrap"
                    onClick={() => setViewState("users")}
                    onMouseOver={() => setViewState("users")}
                  >
                    <img
                      src="img/prof-float-ico.png"
                      className="float-btn-icons"
                    />
                  </a>
                </div>
              </div>

              <div className="float-btn">
                <div className="dropdown">
                  <button
                    className="btn  popper float-btn-wrap"
                    type="button"
                    onClick={() => setViewState("events")}
                    onMouseOver={() => setViewState("events")}
                  >
                    <img
                      src="img/loc-float-ico.png"
                      className="float-btn-icons"
                    />
                  </button>
                </div>
              </div>
              <div className="float-btn">
                <div className="dropdown">
                  <button
                    className="btn  float-btn-wrap"
                    type="button"
                    onClick={() => setViewState("blogs")}
                    onMouseOver={() => setViewState("blogs")}
                  >
                    <img
                      src="img/chat-float-ico.png"
                      className="float-btn-icons"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default requireAuth(Home);
