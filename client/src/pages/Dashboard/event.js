import React, {useState} from 'react';

import {Link, useHistory} from 'react-router-dom';

const Event = () => {
  const history = useHistory();
  const [myEvents, setMyEvents] = useState([]);
  const [myMicroblogs, setMyMicroblogs] = useState([]);

  const goToCreateEventPage = () => {
    history.push('/create-event');
  };

  const viewEvent = () => {};

  const addLike = () => {};

  const createNewMicroblog = () => {};

  const openMicroblogFromList = () => {};

  const getMicroblogPic = () => {};

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
                onClick={() => viewEvent(event)}
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
                  <Link to="" className="event-box-like-event">
                    <i
                      className={
                        event.likes.length > 0
                          ? 'event-box-liked fa fa-heart'
                          : 'fa fa-heart'
                      }
                      onClick={() => addLike(event)}
                      aria-hidden="true"
                    />
                    {event.likes.length > 0 && (
                      <span>{event.likes.length}</span>
                    )}
                  </Link>
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

      <div className="user-event-box" style={{height: '300px'}}>
        <div style={{height: '18%'}}>
          <h4 className="event-box-heading">
            My Microblogs
            <Link
              to=""
              className="event-box-heading-add-event btnd"
              onClick={() => createNewMicroblog()}
            >
              <i className="fa fa-plus" /> ADD NEW
            </Link>
          </h4>
        </div>
        <div style={{height: '80%', width: '100%', overflowY: 'auto'}}>
          {myMicroblogs.map((myMicroblog, index) => (
            <div
              key={index}
              className="events-wrap-converse"
              style={{cursor: 'pointer'}}
              onClick={() => openMicroblogFromList(myMicroblog)}
              aria-hidden="true"
            >
              <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                <img
                  src={getMicroblogPic(myMicroblog.microblogImage)}
                  className="events-convers-img"
                  alt="events"
                />
              </div>
              <div className="col-md-9 col-sm-9 col-xs-9 colPadZero">
                <div className="event-heading-convers">
                  <span>{myMicroblog.name}</span>
                </div>
                <div className="event-sub-heading-convers">
                  {/* <span>on {myMicroblog.created_date | date: 'shortDate'}</span> */}
                </div>
              </div>
              <div className="col-md-1 col-sm-1 col-xs-1 colPadZero my-microblog-seperator-border">
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
