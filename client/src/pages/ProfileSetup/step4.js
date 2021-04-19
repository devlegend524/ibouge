import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {MapContainer, TileLayer, useMapEvents} from 'react-leaflet';
import GeoCoder from '../../components/GeoCoder';
import 'leaflet/dist/leaflet.css';

import {setProfile} from '../../actions/registerActions';

const StepFour = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.sess);
  const [coordinates, setCoordinates] = useState([37.7577, -122.4376]);
  const [extraCityToFollow0, setExtraCityToFollow0] = useState({});
  const [extraCityToFollow1, setExtraCityToFollow1] = useState({});
  const [extraCityToFollow2, setExtraCityToFollow2] = useState({});

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
    if (user.account_type === 0) {
      history.push('/');
    } else {
      history.push('/profile_setup/step5');
    }
  };
  const handleSearch1 = (city) => {
    console.log(city);
    setExtraCityToFollow0({
      cityName: city.geocode.name,
      bbox: city.geocode.bbox,
      center: [city.geocode.center.lat, city.geocode.center.lng],
    });
  };
  const handleSearch2 = (city) => {
    setExtraCityToFollow1({
      cityName: city.geocode.name,
      bbox: city.geocode.bbox,
      center: [city.geocode.center.lat, city.geocode.center.lng],
    });
  };
  const handleSearch3 = (city) => {
    setExtraCityToFollow2({
      cityName: city.geocode.name,
      bbox: city.geocode.bbox,
      center: [city.geocode.center.lat, city.geocode.center.lng],
    });
  };
  const handlePrevClick = () => {
    history.push('/profile_setup/step3');
  };
  return (
    <div className="container containerWidth">
      <div className="row">
        <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
        <div className="col-md-10 col-sm-10 col-12">
          <span className="profile-set-head">Follow the location</span>
          <form>
            <div style={{width: '100%'}}>
              <h4
                className="inner-subheadings-more"
                style={{marginBottom: '30px'}}
              >
                Select 3 cities to follow
              </h4>
              <div className="col-md-4 col-sm-4 col-12">
                <div
                  id="followLocation1Map"
                  style={{width: '100%', height: '100%'}}
                  className="hidden"
                ></div>
                <p
                  className="login-greeting-sub-head"
                  style={{textAlign: 'left !important'}}
                >
                  First City
                </p>
                <div id="followLocation1Search">
                  <MapContainer
                    style={{height: '150px', width: '100%'}}
                    zoom={9}
                    zoomControl={false}
                    center={coordinates}
                  >
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <GeoCoder handleSearch={handleSearch1} />
                  </MapContainer>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-12">
                <div
                  id="followLocation2Map"
                  style={{width: '100%', height: '100%'}}
                  className="hidden"
                ></div>
                <p
                  className="login-greeting-sub-head mt-2"
                  style={{textAlign: 'left !important'}}
                >
                  Second City
                </p>
                <div id="followLocation2Search">
                  <MapContainer
                    style={{height: '150px', width: '100%'}}
                    zoom={9}
                    zoomControl={false}
                    center={coordinates}
                  >
                    <GeoCoder handleSearch={handleSearch2} />
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </MapContainer>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-12">
                <div
                  id="followLocation3Map"
                  style={{width: '100%', height: '100%'}}
                  className="hidden"
                ></div>
                <p
                  className="login-greeting-sub-head mt-2"
                  style={{textAlign: 'left !important'}}
                >
                  Third City
                </p>
                <div id="followLocation3Search">
                  <MapContainer
                    style={{height: '150px', width: '100%'}}
                    zoom={9}
                    zoomControl={false}
                    center={coordinates}
                  >
                    <GeoCoder handleSearch={handleSearch3} />
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </MapContainer>
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
                  style={{width: '100%'}}
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
