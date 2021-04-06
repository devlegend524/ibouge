import React, { useState } from "react";
import { useSelector } from "react-redux";
import ReactMapboxGl, { ZoomControl, Source, Layer } from "react-mapbox-gl";
import Modal from "react-bootstrap/Modal";
import AddfollowCities from "./addFollowCities";
import "mapbox-gl/dist/mapbox-gl.css";

const MapBox = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiaWJvdWdlIiwiYSI6ImNqY2wzaXJ5YTAycWIzM2pyb3JhN20yenkifQ.jhimhHWkb-6GD3Tq8bvCKA",
});

const navStyle = {
  position: "absolute",
  bottom: 100,
  right: 0,
  padding: "10px",
};

const Map = () => {
  const user = useSelector((state) => state.auth.sess);
  const [citiesToFollow, setCitiesToFollow] = useState([
    user.location.extraCityToFollow0,
    user.location.extraCityToFollow1,
    user.location.extraCityToFollow2,
  ]);
  const [city, setCity] = useState(citiesToFollow[0]);
  const [modalShow, setModalShow] = useState(false);
  const switchCity = (city) => {
    setCity(city);
  };

  const addNewLocationToFollow = () => {
    setModalShow(true);
  };

  const mapAfterMoveEnd = () => {};

  return (
    <>
      <div className="user-event-map-box">
        <h4 className="event-box-heading event-map-box-padding-style">
          <div className="dropdown event-map-box-dropdown-style">
            <button
              className="btn btn-default dropdown-toggle search-form-prof-btn btn-map-area-color"
              type="button"
              id="city_follows"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{ textAlign: "center" }}
            >
              {city.cityName}
              <span className="caret caret-margin"></span>
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="city_follows"
              style={{ fontSize: "large", textAlign: "center" }}
            >
              <li
                style={{ cursor: "pointer" }}
                onClick={() => switchCity(citiesToFollow[0])}
                aria-hidden="true"
              >
                {citiesToFollow[0].cityName}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => switchCity(citiesToFollow[1])}
                aria-hidden="true"
              >
                {citiesToFollow[1].cityName}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => switchCity(citiesToFollow[2])}
                aria-hidden="true"
              >
                {citiesToFollow[2].cityName}
              </li>
            </ul>
          </div>
          <a
            className="event-box-heading-add-event"
            onClick={addNewLocationToFollow}
            style={{ cursor: "pointer" }}
            aria-hidden="true"
          >
            <i aria-hidden="true"></i>EDIT
          </a>
        </h4>

        <MapBox
          style="https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB"
          containerStyle={{
            height: "200px",
            width: "100%",
          }}
          center={city.center}
          zoom={[13]}
        >
          <div className="nav" style={navStyle}>
            <ZoomControl />
          </div>
          <Source
            id="point"
            geoJsonSource={{
              type: "geojson",
              data: {
                type: "Point",
                coordinates: city.center,
              },
            }}
          />
          <Layer
            id="point"
            type="circle"
            sourceId="point"
            paint={{
              "circle-radius": {
                stops: [
                  [0, 0],
                  [20, 10000],
                ],
                base: 2,
              },
              "circle-color": "#FAC82D",
              "circle-opacity": 0.25,
              "circle-stroke-color": "#FAC82D",
              "circle-stroke-width": 2,
            }}
          />
        </MapBox>
      </div>
      <Modal
        size="lg"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        style={{ zIndex: "9999" }}
      >
        <Modal.Body>
          <AddfollowCities citiesToFollow={citiesToFollow} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Map;
