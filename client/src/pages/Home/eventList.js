import React from 'react';
import {useHistory} from 'react-router-dom';
import noAvailableImg from '../../assets/img/noImageAvailable.jpg';
const EventList = (props) => {
  const history = useHistory();
  const goToEvent = (id) => {
    console.log(id);
    if (id !== undefined) {
      history.push(`/event/${id}`);
    }
  };
  console.log('====event props=====', props.data);
  return (
    <>
      <h2 className="amount-of-microblogs">{props.data?.length} Events</h2>
      {props.data &&
        props.data.map((event, key) => (
          <div
            className="events-wrap-view"
            onClick={() => goToEvent(event.properties.id)}
            style={{cursor: 'pointer'}}
            key={key}
          >
            <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
              <img
                src={
                  event.properties.eventImage
                    ? event.properties.eventImage
                    : noAvailableImg
                }
                className="img-of-creator"
                alt="creator"
              />
            </div>
            <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
              <div className="name-of-microblog">
                <span>{event.properties.name}</span>
              </div>
              <div className="amount-of-users">
                <a href="" className="microblog-box-users microblog-users">
                  <i className="fa fa-user" aria-hidden="true"></i>
                  <span>{event.properties.usersWhoAreGoing?.length}</span>
                </a>
                <span>
                  {event.properties.dateOfEvent} @{' '}
                  {event.properties.eventStartTime}
                </span>
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
    </>
  );
};

export default EventList;
