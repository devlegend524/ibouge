import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import useSocket from 'use-socket.io-client';
import {MapContainer, TileLayer, MapConsumer} from 'react-leaflet';
import Nabvar from '../../components/Navbar';
import {socketUrl} from '../../constants';

import 'leaflet/dist/leaflet.css';

const Event = (props) => {
  const param = useParams();
  const auth = useSelector((state) => state.auth);
  const [socket] = useSocket(socketUrl);
  socket.connect();
  const defaultEventsData = useSelector((state) => state.events.events);
  const [event, setMyEvents] = useState([]);
  const [goingStatus, setGoingStatus] = useState(false);
  const [coordinates, setCoordinates] = useState([
    8.5067269,
    76.95542742637011,
  ]);
  useEffect(() => {
    setMyEvents(defaultEventsData.filter((item) => item._id === param.id)[0]);
    event?.location?.coordinates && setCoordinates(event.location.coordinates);
  }, []);
  useEffect(() => {
    socket.on('connect', function () {
      const interval = setInterval(function () {
        if (auth.sess) {
          socket.emit('addUserID', {
            id: auth.sess._id,
          });
          clearInterval(interval);
        }
      }, 3000);
    });

    // this socket sends data to database
    socket.on('going-to-event', function (data) {
      console.log(data);
    });
    socket.on('not-going-to-event', function (data) {
      console.log(data);
    });
  }, []);
  const notGoingToEvent = () => {
    setGoingStatus(false);
    const data = {
      eventID: event._id,
      user: auth.sess._id,
    };
    socket.emit('not-going-to-event', data);
  };
  const goingToEvent = () => {
    setGoingStatus(true);
    const data = {
      eventID: event._id,
      user: auth.sess._id,
    };
    socket.emit('going-to-event', data);
  };
  return (
    <>
      <Nabvar title="Event-View" />
      <section className="content-area-events-bg">
        <div
          style={{
            backgroundColor: 'rgba(70, 52, 132, 0.70)',
            height: '315px',
            marginTop: '-55px',
          }}
        >
          <div className="container containerWidth">
            <div className="row" style={{paddingTop: '11%'}}>
              <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
              <div className="col-md-5 col-sm-5 col-12">
                <div className="col-md-12 col-sm-12 col-12 text-left colPadZero">
                  <div className="user-prof-name-pad">
                    <h3 className="user-prof-name">{event.name}</h3>
                    <span className="user-prof-subinfo">
                      <i className="fa fa-calendar" aria-hidden="true"></i>
                      {event.dateOfEvent} at
                      {event.eventStartTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-5 col-sm-5 col-12">
                <div className="col-md-12 col-sm-12 col-12 text-center user-prof-btns-pad">
                  {goingStatus ? (
                    <button
                      type="submit"
                      className="btn btn-primary chat-invite-purple-btn"
                      onClick={notGoingToEvent}
                      style={{
                        background:
                          '-webkit-linear-gradient(left, #fa834b 0%,#fab04b 100%)',
                      }}
                    >
                      NOT GOING
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary chat-invite-purple-btn"
                      onClick={notGoingToEvent}
                      style={{backgroundColor: 'rgba(131, 121, 183, 0.7)'}}
                    >
                      NOT GOING
                    </button>
                  )}
                  {!goingStatus ? (
                    <button
                      type="submit"
                      className="btn btn-primary chat-invite-orangeEvent-btn"
                      onClick={goingToEvent}
                      style={{
                        background:
                          '-webkit-linear-gradient(left, #fa834b 0%,#fab04b 100%)',
                      }}
                    >
                      GOING
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary chat-invite-orangeEvent-btn"
                      onClick={goingToEvent}
                      style={{backgroundColor: 'rgba(131, 121, 183, 0.7)'}}
                    >
                      GOING
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
            </div>
          </div>
          <div className="row user-prof-name-pad">
            <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
            <div className="col-md-6 col-sm-6 col-12 user-prof-name-pad">
              <h4 className="user-prof-summary-head-fill">Event Description</h4>
              <span className="user-prof-summary-fill">
                {event.description}
              </span>
              <div className="col-md-6 col-sm-6 col-12 colTopPad">
                <span className="user-prof-summary-fill">
                  {event.interested?.length ? event.interested?.length : 0} of
                  your friends are interested
                </span>
                {event.interested &&
                  event.interested.map((friend) => (
                    <img
                      src={friend.img}
                      className="event-frnds-photo"
                      alt="friends"
                    />
                  ))}
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-12 user-prof-name-pad">
              <div id="chartEventMap">
                <MapContainer
                  style={{height: '300px', width: '100%'}}
                  zoom={9}
                  center={coordinates}
                >
                  <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapConsumer>
                    {(map) => {
                      map.setView(coordinates);
                      return null;
                    }}
                  </MapConsumer>
                </MapContainer>
              </div>
            </div>
            <div className="col-md-1 col-sm-1 col-12 text-center d-block d-sm-none"></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container containerWidth">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
            <div className="col-md-4 col-sm-4 col-12 text-center">
              <a href="">About</a>
              <a href="">Team</a>
              <a href="">Contact</a>
              <a href="">Mission</a>
              <a href="">Technology</a>
            </div>
            <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Event;
