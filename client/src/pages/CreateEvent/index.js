import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Nabvar from '../../components/Navbar';
// using import
import FileUploadWithPreview from 'file-upload-with-preview';
import {createEvent} from '../../actions/eventAction';
// JavaScript
import L from 'leaflet';

import {
  MapContainer,
  TileLayer,
  MapConsumer,
  LayersControl,
  useMapEvents,
} from 'react-leaflet';
import GeoCoder from '../../components/GeoCoder';

import './styles.scss';
import 'file-upload-with-preview/dist/file-upload-with-preview.min.css';
import 'leaflet/dist/leaflet.css';
import {useHistory} from 'react-router-dom';
// initialize a new FileUploadWithPreview object

const CreateEvent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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
    console.log('submitting...');
    dispatch(createEvent(enentData));
    history.push('/');
  };

  useEffect(() => {
    const upload = new FileUploadWithPreview('myUniqueUploadId', {
      showDeleteButtonOnImages: true,
      text: {
        chooseFile: 'Please Choose Event Image File',
        browse: 'Upload',
        selectedCount: 'Custom Files Selected Copy',
      },
    });
    setEventFile(upload.cachedFileArray);
  }, []);
  const handleUpdateCity = (data) => {
    console.log(data);
    setLocation({
      coordinates: [data.geocode.center.lat, data.geocode.center.lng],
      bbox: data.geocode.bbox,
      addrs1: data.geocode.properties.address.suburb,
      addrs2: data.geocode.properties.address.borough,
      country: data.geocode.properties.address.country,
      state: data.geocode.properties.address.state,
      city: data.geocode.properties.address.city,
      zip: data.geocode.properties.address.country_code,
    });
  };
  const MyComponent = () => {
    const map = useMapEvents({
      click: (e) => {
        map.setView(e.latlng);
        map.locate();
        new L.CircleMarker(e.latlng, {
          radius: 5,
          fillColor: 'blue',
          width: 0.5,
          stroke: 'black',
          color: '#000080',
          fillOpacity: 0.5,
        }).addTo(map);
        setLocation({
          coordinates: [e.latlng.lat, e.latlng.lng],
          bbox: map.getBounds(),
        });
        // props.saveSelection(locations);
      },
      locationfound: (location) => {
        console.log('location found:', location);
      },
    });
    return null;
  };
  return (
    <>
      <Nabvar title="Create-Event" />
      <section className="content-area whiteBg">
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
                    <label className="event_label">Event name</label>
                    <input
                      type="text"
                      className="form-control input"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <label className="event_label">Event category</label>
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
                    <label className="event_label">Start Date</label>
                    <input
                      type="date"
                      className="form-control calendar-icon input"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    <div className="start-end-div">
                      <div className="start-time-div">
                        <label className="event_label">Start time</label>
                        <input
                          type="time"
                          className="form-control calendar-icon input"
                          name="startTimeOfEvent"
                          value={start_time}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                      </div>
                      <div className="end-time-div">
                        <label className="event_label">End time</label>
                        <input
                          type="time"
                          className="form-control calendar-icon input"
                          name="endTimeOfEvent"
                          value={end_time}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-12 event-description-div">
                  <div>
                    <div className="form-group form-spacing">
                      <label className="event_label">Event Description</label>
                      <textarea
                        type="text"
                        className="form-control event-description-input textarea"
                        name="eventDescription"
                        placeholder="For example how would you describe this event."
                        style={{height: '30vh'}}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2 col-sm-2 col-12"></div>
                <div className="col-md-8 col-sm-8 col-12">
                  <div
                    className="custom-file-container"
                    data-upload-id="myUniqueUploadId"
                  >
                    <label className="event_label">
                      Upload File
                      <a
                        href=""
                        className="custom-file-container__image-clear"
                        title="Clear Image"
                      >
                        &times;
                      </a>
                    </label>
                    <label className="custom-file-container__custom-file">
                      <input
                        type="file"
                        className="custom-file-container__custom-file__custom-file-input"
                        accept="image/*"
                        aria-label="Choose File"
                      />
                      <input
                        type="hidden"
                        name="MAX_FILE_SIZE"
                        value="10485760"
                      />
                      <span className="custom-file-container__custom-file__custom-file-control"></span>
                    </label>
                    <div className="custom-file-container__image-preview"></div>
                  </div>
                </div>
                <div className="col-md-2 col-sm-2 col-12"></div>
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
                    <MapContainer
                      style={{height: '300px', width: '100%'}}
                      zoom={9}
                      zoomControl={false}
                      center={coordinates}
                    >
                      <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <GeoCoder handleSearch={handleUpdateCity} />
                      {/* <MyComponent /> */}
                    </MapContainer>
                  </div>
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
