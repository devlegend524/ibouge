import React, {useState, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import InteractiveMap, {
  Source,
  Layer,
  NavigationControl,
  GeolocateControl,
} from 'react-map-gl';
import axios from 'axios';

import Geocoder from 'react-map-gl-geocoder';
import Nabvar from '../../components/Navbar';
import {createEvent} from '../../actions/eventAction';
import {MAPBOX_TOKEN} from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import './styles.scss';
const mapStyle =
  'https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB';
const navControlStyle = {
  cursor: 'pointer',
  right: 10,
  bottom: 50,
};
const getControlStyle = {
  cursor: 'pointer',
  right: 10,
  bottom: 10,
};
const layerStyle = {
  id: 'point',
  type: 'circle',
  source: 'single-point',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
};

const CreateEvent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const handleClick = (target) => {
    setStep(target);
  };
  const [step, setStep] = useState('step1');
  const [coordinates, setCoordinates] = useState(
    user.sess.location.coordinates
  );
  const [name, setName] = useState('');
  const [category, setCategory] = useState('1');
  const [date, setDate] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const [eventFile, setEventFile] = useState('');
  const [locations, setLocation] = useState({
    coordinates: user.sess.location.coordinates,
    bbox: [],
    addrs1: '',
    addrs2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
  });
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });
  const [geojson] = useState({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {type: 'Point', coordinates: coordinates},
      },
    ],
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const enentData = {
      file: eventFile,
      data: {
        ...locations,
        userId: user.sess._id,
        category: category,
        createdBy: user.sess._id,
        date: date,
        endTimeOfEvent: end_time,
        eventDescription: description,
        going: {
          userGoing: '',
          confirmationDate: '',
        },
        startTimeOfEvent: start_time,
        name: name,
      },
    };
    console.log('summitting...');
    dispatch(createEvent(enentData));
  };
  const _onClick = (event) => {
    const lng = event.lngLat[0];
    const lat = event.lngLat[1];
    console.log('long', lng);
    console.log('lati', lat);
    setCoordinates([lng, lat]);
    const reverseGeocodingURL =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      lng +
      ',' +
      lat +
      `.json?access_token=${MAPBOX_TOKEN}`;
    axios.get(reverseGeocodingURL).then(function (response) {
      if (response.data.features.length > 0) {
        setLocation({
          coordinates: coordinates,
          bbox: [],
          addrs1: response.data.features[0].place_name,
          addrs2: response.data.features[0].context[1].text,
          country: response.data.features[0].context[4].text,
          state: response.data.features[0].context[3].text,
          city: response.data.features[0].context[2].text,
          zip: response.data.features[0].context[0].text,
        });
        handleMapClicked(locations);
      }

      handleViewportChange({
        latitude: lat,
        longitude: lng,
        zoom: 9,
      });
    });
  };
  const mapRef = useRef();
  const handleMapClicked = (newLocations) => {
    console.log('new_location', newLocations);
    setLocation(newLocations);
  };
  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
  }, []);
  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = {transitionDuration: 1000};
    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  return (
    <>
      <Nabvar title="Create-Event" />
      <section className="content-area whiteBg chosen-font">
        <form name="createEventForm">
          {step === 'step1' ? (
            <div className="container">
              <div className="row">
                <span className="profile-set-head">
                  1/2 Enter Event Details
                </span>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 col-12"></div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-12 left-small-group">
                  <div className="form-group form-spacing first-form">
                    <label>Event name</label>
                    <input
                      type="text"
                      className="form-control input"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label>Event category</label>
                    <select
                      className="form-control input category"
                      name="category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="1">Restaurant</option>
                      <option value="2">Entertainment</option>
                      <option value="3">Health & Fitness</option>
                      <option value="4">Shopping</option>
                      <option value="5">Offer/Discount</option>
                      <option value="6">Hobby</option>
                      <option value="7">Other</option>
                    </select>
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control calendar-icon input"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <div className="start-end-div">
                      <div className="start-time-div">
                        <label>Start time</label>
                        <input
                          type="time"
                          className="form-control calendar-icon input"
                          name="startTimeOfEvent"
                          value={start_time}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="end-time-div">
                        <label>End time</label>
                        <input
                          type="time"
                          className="form-control calendar-icon input"
                          name="endTimeOfEvent"
                          value={end_time}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-12 event-description-div">
                  <div>
                    <div className="form-group form-spacing">
                      <label>Event Description</label>
                      <textarea
                        type="text"
                        className="form-control event-description-input textarea"
                        name="eventDescription"
                        placeholder="For example how would you describe this event."
                        style={{height: '30vh'}}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2 col-sm-2 col-12"></div>
                <div
                  ng-hide="event.img.isSet"
                  className="col-md-8 col-sm-8 col-12"
                >
                  <input
                    type="file"
                    name="eventFile"
                    id="eventfile"
                    className="inputfile"
                    onChange={(e) => setEventFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="eventfile"
                    className="box has-advanced-upload form-box"
                    style={{cursor: 'pointer'}}
                  >
                    <p
                      htmlFor="eventfile"
                      className="box-big-text"
                      style={{cursor: 'pointer'}}
                    >
                      DROP OR BROWSE COVER PHOTO TO UPLOAD
                    </p>
                    <p
                      htmlFor="eventfile"
                      className="box-small-text"
                      style={{cursor: 'pointer'}}
                    >
                      recommended size is 1024x920
                    </p>
                  </label>
                </div>
              </div>
              <div
                className="next-step-column col-md-8 col-sm-8 col-12"
                style={{marginTop: '3%', float: 'right'}}
              >
                <a
                  className="next-step-button btn"
                  onClick={() => handleClick('step2')}
                >
                  NEXT TO LOCATION DETAILS
                </a>
              </div>
            </div>
          ) : (
            <div className="container containerWidth">
              <div className="back-arrow" onClick={() => handleClick('step1')}>
                <i className="fa fa-chevron-left arrow-icon"></i>
              </div>

              <span className="profile-set-head">
                2/2 Enter Location Details
              </span>
              <p
                className="profile-set-head"
                style={{color: '#484A5A', fontSize: 'large'}}
              >
                Add event details: Click on map
              </p>

              <div className="step-two-div">
                <div id="mapWrapper">
                  <div id="event-location-map">
                    <InteractiveMap
                      {...viewport}
                      ref={mapRef}
                      width="100%"
                      height="100%"
                      mapStyle={mapStyle}
                      onViewportChange={handleGeocoderViewportChange}
                      onClick={(e) => _onClick(e)}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                    >
                      <Geocoder
                        mapRef={mapRef}
                        onViewportChange={handleGeocoderViewportChange}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        position="top-right"
                      />
                      <Source id="single-point" type="geojson" data={geojson}>
                        <Layer {...layerStyle} />
                      </Source>
                      <NavigationControl style={navControlStyle} />
                      <GeolocateControl style={getControlStyle} />
                    </InteractiveMap>
                  </div>
                  <p
                    className="profile-set-head"
                    style={{marginTop: '10px', color: '#484A5A'}}
                  >
                    Search for an address
                  </p>
                  <div id="createEventGeocoder"></div>
                  <button
                    type="submit"
                    className="create-event-button"
                    onClick={(e) => handleCreateEvent(e)}
                  >
                    CREATE EVENT
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </section>
    </>
  );
};

export default CreateEvent;
