import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import {
  MapContainer,
  TileLayer,
  MapConsumer,
  LayersControl,
  Marker,
  Popup,
} from 'react-leaflet';
import GeoCoder from '../../components/GeoCoder';
import {setProfile} from '../../actions/registerActions';

import 'leaflet/dist/leaflet.css';

const Map = (props) => {
  const user = useSelector((state) => state.auth.sess);
  const dispatch = useDispatch();
  const [citiesToFollow0, setCitiesToFollow0] = useState(
    user.location.extraCityToFollow0
  );
  const [citiesToFollow1, setCitiesToFollow1] = useState(
    user.location.extraCityToFollow1
  );
  const [citiesToFollow2, setCitiesToFollow2] = useState(
    user.location.extraCityToFollow2
  );
  const [city, setCity] = useState({
    city: citiesToFollow0,
    type: 0,
  });
  const [coordinates, setCoordinates] = useState(city.city.center);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveLocationToFollow = () => {
    setOpen(false);

    dispatch(
      setProfile({
        location: {
          extraCityToFollow0: citiesToFollow0,
          extraCityToFollow1: citiesToFollow1,
          extraCityToFollow2: citiesToFollow2,
        },
      })
    );
  };
  const handleUpdateCity = (data) => {
    if (city.type === 0) {
      setCitiesToFollow0({
        cityName: data.geocode.name,
        bbox: data.geocode.bbox,
        center: [data.geocode.center.lat, data.geocode.center.lng],
      });
      setCity({
        city: citiesToFollow0,
        type: 0,
      });
    } else if (city.type === 1) {
      setCitiesToFollow1({
        cityName: data.geocode.name,
        bbox: data.geocode.bbox,
        center: [data.geocode.center.lat, data.geocode.center.lng],
      });
      setCity({
        city: citiesToFollow1,
        type: 1,
      });
    } else {
      setCitiesToFollow2({
        cityName: data.geocode.name,
        bbox: data.geocode.bbox,
        center: [data.geocode.center.lat, data.geocode.center.lng],
      });
    }
    setCity({
      city: citiesToFollow2,
      type: 2,
    });
  };
  const changeCityToFollow = (city) => {};
  const switchCity = (city, type) => {
    setCity({
      city: city,
      type: type,
    });
    setCoordinates(city.center);
  };

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
              style={{textAlign: 'center'}}
            >
              {city?.city.cityName.substring(0, 15)}...
              <span className="caret caret-margin"></span>
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="city_follows"
              style={{fontSize: 'large', textAlign: 'center'}}
            >
              <li
                style={{cursor: 'pointer'}}
                onClick={() => switchCity(citiesToFollow0, 0)}
                aria-hidden="true"
              >
                {citiesToFollow0?.cityName.substring(0, 15)}...
              </li>
              <li
                style={{cursor: 'pointer'}}
                onClick={() => switchCity(citiesToFollow1, 1)}
                aria-hidden="true"
              >
                {citiesToFollow1?.cityName.substring(0, 15)}...
              </li>
              <li
                style={{cursor: 'pointer'}}
                onClick={() => switchCity(citiesToFollow2, 2)}
                aria-hidden="true"
              >
                {citiesToFollow2?.cityName.substring(0, 15)}...
              </li>
            </ul>
          </div>
          <a
            className="event-box-heading-add-event"
            onClick={handleClickOpen}
            style={{cursor: 'pointer'}}
            aria-hidden="true"
          >
            <i aria-hidden="true"></i>EDIT
          </a>
        </h4>
        <div id="chartEventViewMap">
          <MapContainer
            style={{height: '200px', width: '100%'}}
            zoom={9}
            zoomControl={false}
            center={coordinates}
          >
            <MapConsumer>
              {(map) => {
                map.setView(coordinates);
                return null;
              }}
            </MapConsumer>
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Color Map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer checked name="GrayScale Map">
                <TileLayer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
              </LayersControl.BaseLayer>
            </LayersControl>
            <Marker position={coordinates}>
              <Popup>My current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
      >
        <DialogContent>
          <button
            type="button"
            onClick={handleClose}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <i
              className="fa fa-times-circle"
              style={{fontSize: '30px', padding: '10px'}}
            ></i>
          </button>
          <div
            style={{
              height: '100%',
              width: '100%',
              lineHeight: 'normal',
            }}
          >
            <div style={{width: '100%', height: '85%', marginTop: '15%'}}>
              <div style={{width: '94%', margin: '0 3% 0 3%'}}>
                <h2 align="center">Top Cities</h2>
                <h4 id="chooseLocationToChange" align="center">
                  Choose up to three locations to follow for updates
                </h4>
                <h4 id="chooseLocationToChange" align="center">
                  Select a city to update to new city
                </h4>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 'large',
                    color: '#f2b200',
                  }}
                >
                  <span
                    id="extraCityToFollow0"
                    className="hoverOver"
                    onClick={changeCityToFollow('extraCityToFollow0')}
                  >
                    {citiesToFollow0?.cityName.substring(0, 15)}...
                  </span>
                  <br />

                  <span
                    id="extraCityToFollow1"
                    className="hoverOver"
                    onClick={changeCityToFollow('extraCityToFollow1')}
                  >
                    {citiesToFollow1?.cityName.substring(0, 15)}...
                  </span>
                  <br />

                  <span
                    id="extraCityToFollow2"
                    className="hoverOver"
                    onClick={changeCityToFollow('extraCityToFollow2')}
                  >
                    {citiesToFollow2?.cityName.substring(0, 15)}...
                  </span>
                </div>

                <div
                  id="followAnotherLocationMap"
                  style={{width: '100%', height: '300px', marginTop: '15px'}}
                >
                  <MapContainer
                    style={{height: '300px', width: '100%'}}
                    zoom={9}
                    zoomControl={false}
                    center={coordinates}
                  >
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <GeoCoder handleSearch={handleUpdateCity} />
                  </MapContainer>
                </div>
                <button
                  className="btn btn-primary ibg-btn ibg-btn-create"
                  style={{
                    width: '100%',
                    height: '50px',
                    background: '#6D00A2',
                    fontSize: 'large',
                    color: 'white',
                    marginTop: '10px',
                  }}
                  onClick={saveLocationToFollow}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Map;
