import React, {useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Link, useHistory} from 'react-router-dom';
import {getAllEvents} from '../../actions/eventAction';

import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';

const Event = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [socket] = useSocket(socketUrl);
  socket.connect();
  const [myEvents, setMyEvents] = useState([]);
  const defaultEventsData = useSelector((state) => state.events.events);
  const user = useSelector((state) => state.auth.sess);
  const goToCreateEventPage = () => {
    history.push('/create-event');
  };
  useEffect(() => {
    let interval = setInterval(function () {
      if (user) {
        socket.emit('addUserID', {
          id: user._id,
        });
        clearInterval(interval);
      }
    }, 3000);
    dispatch(getAllEvents());
    setMyEvents(
      defaultEventsData.filter((item) => item.createdBy === user._id)
    );
  }, []);
  useEffect(() => {
    setMyEvents(
      defaultEventsData.filter((item) => item.createdBy === user._id)
    );
  }, [defaultEventsData]);
  const viewEvent = (id) => {
    history.push(`/event/${id}`);
  };

  const addLike = (e, event) => {
    let inList;
    const data = {
      event: event._id,
      me: user._id,
    };
    if (event.likes && event.likes.length > 0) {
      for (var i = 0; i < event.likes.length; i++) {
        if (data.me === event.likes[i].user) {
          inList = true;
          //if user is found, iteration will stop
          break;
        } else {
          inList = false;
        }
      }

      // if user is in the list of likes, user will be removed from list
      if (inList) {
        // here we find the index of the event in the myEvents array
        var a = myEvents
          .map(function (x) {
            return x._id;
          })
          .indexOf(data.event);

        // here we find the index of the user in the myEvents[a].likes array
        var likesIndex = myEvents[a].likes
          .map(function (y) {
            return y.user;
          })
          .indexOf(data.me);

        // with both of those indexes we can now update the local myEvents.likes array, which will affect
        const newData = [...myEvents];

        // immediately the number of likes displayed
        newData[a].likes.splice(likesIndex, likesIndex + 1);
        setMyEvents([...newData]);
        // but database also needs to be updated, here
        socket.emit('remove-event-like', data);
        // if user is not in the likes list, user will be added to it
      } else {
        // we find the index of event to be updated
        var b = myEvents
          .map(function (x) {
            return x._id;
          })
          .indexOf(data.event);

        const newData = [...myEvents];

        // immediately the number of likes displayed
        myEvents[b].likes.push({
          user: data.me,
          date: Date.now(),
        });
        setMyEvents([...newData]);
        // local myEvents array is updated

        // databse info is updated
        socket.emit('add-event-like', data);
      }
      // if event.likes array is empty, this will push a like automatically
    } else {
      // index found
      var c = myEvents
        .map(function (x) {
          return x._id;
        })
        .indexOf(data.event);
      // local array updated
      const newData = [...myEvents];
      // immediately the number of likes displayed
      myEvents[c].likes.push({user: data.me, date: Date.now()});
      setMyEvents([...newData]);
      // databse updated
      socket.emit('add-event-like', data);
    }
  };
  return (
    <>
      <div style={{height: '300px'}} className="user-event-box">
        <div>
          <h4 className="event-box-heading">
            Local Events
            <span
              className="event-box-heading-add-event"
              style={{cursor: 'pointer'}}
              onClick={goToCreateEventPage}
            >
              <i className="fa fa-plus"></i> ADD NEW
            </span>
          </h4>
        </div>
        <div style={{height: '80%', overflowY: 'auto'}}>
          {myEvents.map((event, index) => (
            <div key={index} className="events-wrap-view">
              <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                <img
                  style={{height: '70px', width: '70px'}}
                  src={event.eventImage}
                  className="events-more-img"
                  alt="events"
                />
              </div>
              <div
                className="col-md-7 col-sm-7 col-xs-7 colPadZero"
                style={{cursor: 'pointer'}}
                onClick={() => viewEvent(event._id)}
                aria-hidden="true"
              >
                <div className="event-heading-style">
                  <span>{event.name}</span>
                </div>
                <div className="event-sub-heading-style"></div>
              </div>
              <div className="col-md-2 col-sm-2 col-xs-2 colPadZero event-seperator-border">
                <div className="event-heading-style">
                  <span className="event-going">{event.status}</span>
                </div>
                <div className="event-sub-heading-style">
                  <a className="event-box-like-event">
                    <i
                      className={
                        event.likes.length > 0
                          ? 'event-box-liked fa fa-heart'
                          : 'fa fa-heart'
                      }
                      onClick={(e) => addLike(e, event)}
                      aria-hidden="true"
                    />
                    {event.likes.length > 0 && (
                      <span>{event.likes.length}</span>
                    )}
                  </a>
                </div>
              </div>
              <div
                className="col-md-1 col-sm-1 col-xs-1 colPadZero"
                style={{cursor: 'pointer'}}
                onClick={() => viewEvent(event)}
                aria-hidden="true"
              >
                <Link to="" className="event-box-arrow-view-event">
                  <i className="fa fa-chevron-right" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Event;
