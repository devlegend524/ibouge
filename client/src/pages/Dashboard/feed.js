import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import dateFormat from "dateformat";
import { getAllStatusUpdates } from "../../actions/feedActions";
import noImageAvailable from "../../assets/img/noImageAvailable.jpg";

const initialStatus = {
  message: {
    status_type: "",
    message: "",
  },
  reply: {
    reply_type: "text",
    message: "",
  },
};

const initialUpload = {
  src: "",
  type: "",
};

const Feed = () => {
  const [friendsStatusesOnlyShown, setFriendsStatusesOnlyShown] = useState(
    false
  );
  const [mapStatusesOnlyShown, setMapStatusesOnlyShown] = useState(true);
  const [statusType, setStatusType] = useState("text");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusReplyMessage, setStatusReplyMessage] = useState("");
  const [statusReplyType, setStatusReplyType] = useState("text");
  const [upload, setUpload] = useState(initialUpload);
  const [allStatusUpdates, setAllStatusUpdates] = useState([]);
  const [likes, setLikes] = useState([]);

  const dispatch = useDispatch();
  const { sess } = useSelector((state) => state.auth);
  const { statuses } = useSelector((state) => state.feed);

  useEffect(() => {
    // dispatch(getAllStatusUpdates());
  }, []);

  const showOnlyFriendsUpdates = async () => {
    setFriendsStatusesOnlyShown(true);
    setMapStatusesOnlyShown(false);

    const allStatuses = [];
    if (statuses.length > 0) {
      for (let i = 0; i < statuses.length; i++) {
        if (statuses[i].status.length > 0) {
          for (let j = 0; j < statuses[i].status.length; j++) {
            allStatuses.push(statuses[i].status[j]);
          }
        }
      }
    }
    const ownStatuses = _.filter(
      allStatuses,
      (allStatus) => allStatus.from === sess._id
    );
    await getUserName(ownStatuses);
    setAllStatusUpdates(_.orderBy(ownStatuses, ["time"], ["asc"]));
  };

  const showOnlyUsersInMapUpdates = () => {
    setFriendsStatusesOnlyShown(false);
    setMapStatusesOnlyShown(true);
  };

  const handleKeyDown = (event) => {};

  const newStatus = (event, value) => {};

  const removeThumbnail = () => {};

  const addLikeToStatusOrReply = () => {};

  const showsLikesList = () => {};

  const newReply = () => {};

  const getUserName = (ownStatuses) => {
    for (let id = 0; id < ownStatuses.length; id++) {
      const tmp_id = id;
      let profilePic = "";
      const response = axios.get(
        `users/get-user-meta?id=${ownStatuses[id].from}`
      );
      var fname = response.data[0].fname;
      var lname = response.data[0].lname;
      if (
        !response.data[0].profile_pic ||
        response.data[0].profile_pic === ""
      ) {
        profilePic = noImageAvailable;
      } else {
        profilePic = response.data[0].profile_pic;
      }
      try {
        ownStatuses[tmp_id].userFullname = fname + " " + lname;
        ownStatuses[tmp_id].profilePic = profilePic;
      } catch (err) {
        console.log(err);
      }
      if (ownStatuses[tmp_id].replies) {
        for (var j = 0; j < ownStatuses[tmp_id].replies.length; j++) {
          const tmp_j = j;
          const sResponse = axios.get(
            `users/get-user-meta?id=${ownStatuses[tmp_id].replies[j].from}`
          );
          fname = sResponse.data[0].fname;
          lname = sResponse.data[0].lname;
          if (
            !sResponse.data[0].profile_pic ||
            sResponse.data[0].profile_pic === ""
          ) {
            profilePic = noImageAvailable;
          } else {
            profilePic = sResponse.data[0].profile_pic;
          }
          try {
            ownStatuses[tmp_id].replies[tmp_j].userFullname =
              fname + " " + lname;
            ownStatuses[tmp_id].replies[tmp_j].profilePic = profilePic;
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  };

  return (
    <div className="user-event-box" style={{ height: "916px" }}>
      <div>
        <h4 className="status-update-box-heading" style={{ boxShadow: "none" }}>
          Newsfeed
          <span
            className="event-box-heading-add-event btnd"
            onClick={showOnlyFriendsUpdates}
            style={{ color: friendsStatusesOnlyShown ? "#6148a1" : "#ffb940" }}
          >
            FRIENDS
          </span>
          <span
            style={{ marginRight: "25px" }}
            className="event-box-heading-add-event btnd"
            onClick={showOnlyUsersInMapUpdates}
            style={{
              marginRight: "25px",
              color: mapStatusesOnlyShown ? "#6148a1" : "#ffb940",
            }}
          >
            EVERYONE
          </span>
          {/* <a href="" className="event-box-heading-add-event btnd visible-xs" ng-click="showOnlyFriendsUpdates();"
            ng-style="{color: friendsStatusesOnlyShown === true ? '#6148a1' : '#ffb940'}"
            style="font-size:0.7em">FRIENDS</a>
          <a href="" style="margin-right: 7px;font-size: 0.7em;"
            className="event-box-heading-add-event btnd visible-xs" ng-click="showOnlyUsersInMapUpdates();"
            ng-style="{color: mapStatusesOnlyShown === true ? '#6148a1' : '#ffb940'}">EVERYONE</a> */}
        </h4>
        <div style={{ padding: "10px 10px 0px 10px" }}>
          <p className="emoji-picker-container" style={{ textAlign: "center" }}>
            <input
              type="file"
              name="file"
              id="file"
              className="inputfile"
              caption={statusMessage}
            />
            <button
              className="upload-pic-status-button"
              style={{
                width: "10%",
                height: "5%",
                float: "left",
                borderRadius: "5px",
                textAlign: "center",
                border: "2px solid #dadce8",
                fontSize: "1.3em",
                backgroundColor: "white",
                padding: 0,
              }}
            >
              <label
                htmlFor="file"
                style={{ cursor: "pointer", height: "100%", width: "100%" }}
              >
                <i
                  style={{ marginTop: "11px" }}
                  className="fa fa-paperclip"
                ></i>
              </label>
            </button>
            <input type="hidden" name="status" id="status-hidden-input" />
            <textarea
              rows="1"
              emoji-picker="emoji-picker"
              emoji-attachment-location="top left"
              emoji-menu-location="bottom right"
              className="form-control status-message"
              placeholder="What's on your mind?"
              value={statusMessage}
              id="status-emoji-area"
              onChange={(e) => setStatusMessage(e.target.value)}
              style={{
                float: "left",
                width: "76%",
                height: "5%",
                borderRadius: "5px",
                textAlign: "left",
                border: "2px solid #dadce8",
                fontSize: "1.3em",
                resize: "none",
              }}
            />
            <button
              style={{
                width: "14%",
                height: "5%",
                float: "left",
                borderRadius: "5px",
                textAlign: "center",
                border: "2px solid #dadce8",
                fontSize: "1.3em",
                backgroundColor: "white",
                padding: "7px 0 0 0",
                boxShadow: "unset",
              }}
              onClick={newStatus(statusMessage)}
            >
              <label
                htmlFor="button"
                style={{ cursor: "pointer", height: "100%" }}
              >
                Post
              </label>
            </button>
          </p>
          {upload.src && <div style={{ clear: "both" }}></div>}
          {upload.type === "image" && (
            <div className="thumbnail">
              <Link to="" onClick={removeThumbnail}>
                <i
                  className="fa fa-times"
                  style={{
                    float: "right",
                    marginRight: "7px",
                    marginBottom: "3%",
                    marginTop: "2%",
                  }}
                />
              </Link>
              <img
                className="img-responsive"
                src={upload.src}
                style={{ marginBottom: "10px" }}
                alt="upload"
              />
            </div>
          )}
          {upload.type === "video" && (
            <div className="thumbnail">
              <Link to="" onClick={removeThumbnail}>
                <i
                  className="fa fa-times"
                  style={{
                    float: "right",
                    marginRight: "7px",
                    marginBottom: "3%",
                    marginTop: "2%",
                  }}
                />
              </Link>
              <video
                width="320"
                height="240"
                poster="/images/w3html5.gif"
                controls
                className="img-responsive"
                muted
              >
                <source src={upload.src} type={upload.mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: "84%", width: "100%", overflowY: "auto" }}>
        {allStatusUpdates.length === 0 && (
          <div className="status-updates-wrap-converse">
            <div className="col-7">
              <div className="text-center" style={{ padding: "10px 0 0 0" }}>
                <h4>
                  Sorry! No posts available for this location yet. Check out
                  another location
                </h4>
              </div>
            </div>
          </div>
        )}
        {allStatusUpdates.map((status, index) => (
          <div key={index} className="status-updates-wrap-converse">
            <div className="col-md-11 col-sm-11 col-xs-11 colPadZero">
              <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                <Link to={`/profile/${status.from}`}>
                  <img
                    src={status.profilePic}
                    className="events-convers-img"
                    alt="events"
                  />
                </Link>
              </div>
              <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
                <div
                  className="event-heading-style"
                  style={{ padding: "10px 0 0 0" }}
                >
                  <span>{status.userFullname}</span>
                </div>
                <div
                  className="event-sub-heading-style"
                  style={{ textTransform: "none", padding: 0 }}
                >
                  <span style={{ fontSize: "15px" }}>
                    {dateFormat(new Date(status.time), "mmmm dd")} at{" "}
                    {dateFormat(new Date(status.time), "shortTime")}
                  </span>
                </div>
              </div>
            </div>
            {/* {status.from === sess._id && <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
            <a ng-confirm-click="Are you sure to delete this status?"
              confirmed-click="removeStatus(status)"><i className="fa fa-times"
                style="float: right; margin-right: 7px; margin-top: 10px;"></i></a>
          </div>} */}
            <div className="col-md-12 col-sm-12 col-xs-12 colPadZero">
              <div
                className={
                  statusType == "image" || statusType == "video"
                    ? "hidden"
                    : "event-heading-convers"
                }
                style={{
                  fontSize: "1.6em",
                  padding: "25px",
                  textAlign: "center",
                  whiteSpace: "normal",
                }}
              >
                <p>{status.message}</p>
              </div>
              {status.caption !== "" && (
                <div
                  className={
                    statusType == "text" ? "hidden" : "event-heading-convers"
                  }
                  style={{
                    fontSize: "1.6em",
                    padding: "25px",
                    textAlign: "center",
                    whiteSpace: "normal",
                  }}
                >
                  {/* <p ng-bind-html="status.caption | linky:'_blank'"></p> */}
                </div>
              )}
              {status.message.includes("https://www.youtube.com/") && (
                <iframe
                  style={{ width: "100%", height: "315px", padding: "5px" }}
                  src={status.message}
                  frameborder="0"
                  title="youtube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              )}
              <Link to={`/${status.message}`}>
                {statusType == "image" && (
                  <img
                    src={status.message}
                    style={{ width: "100%", marginTop: "4px", padding: "5px" }}
                    alt="status"
                  />
                )}
              </Link>
              {statusType == "video" && (
                <video
                  controls
                  style={{ width: "100%", marginTop: "4px", padding: "5px" }}
                  muted
                >
                  <source src={status.message} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 colPadZero comment-section">
              <input
                type="hidden"
                name="status"
                id={`hidden-comment-${status._id}`}
              />
              <input
                placeholder="Write a comment!"
                style={{
                  width: "88%",
                  height: "5%",
                  borderRadius: "5px",
                  textAlign: "left",
                  border: "2px solid #dadce8",
                  fontSize: "1.2em",
                  resize: "none",
                  float: "left",
                  marginBottom: "10px",
                  marginLeft: "5px",
                  textIndent: "10px",
                }}
                // emoji-picker="emoji-picker" emoji-attachment-location="top left"
                // emoji-menu-location="bottom right" ng-model="status.reply.message"
                onKeyPress={() => newReply(status, statusReplyMessage)}
                onKeyUp={() => handleKeyDown(status._id)}
                id={`comment-${status._id}`}
              />
              <Link to="" className="status-update-like">
                <i
                  className={
                    status.likes.length > 0
                      ? "fa fa-heart status-update-box-liked"
                      : "fa fa-heart"
                  }
                  onClick={() => addLikeToStatusOrReply(status)}
                  aria-hidden="true"
                ></i>
                {status.likes.length > 0 && (
                  <span
                    onClick={() => showsLikesList(status.likes)}
                    aria-hidden="true"
                  >
                    {status.likes.length}
                  </span>
                )}
              </Link>
            </div>
            {status.replies.map((reply, index) => (
              <div
                key={index}
                className="status-updates-wrap-converse"
                style={{ width: "99%", padding: 0 }}
              >
                <div className="col-md-2 col-sm-2 col-xs-2 colPadZero"></div>
                <div
                  className="col-md-9 col-sm-9 col-xs-9 colPadZero"
                  style={{ borderLeft: "3px solid #000" }}
                >
                  <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                    <Link to={`/profile/reply.from`}>
                      <img
                        src={reply.profilePic}
                        className="events-convers-img-small"
                        alt="event"
                      />
                    </Link>
                  </div>
                  <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
                    <div
                      className="event-heading-style-small"
                      style={{ padding: "10px 0 0 0" }}
                    >
                      <span className="ng-binding">{reply.userFullname}</span>
                    </div>
                    <div
                      className="event-sub-heading-style-small"
                      style={{ textTransform: "none", padding: 0 }}
                    >
                      <span style={{ fontSize: "15px" }}>
                        {dateFormat(new Date(reply.time), "mmmm dd")} at{" "}
                        {dateFormat(new Date(reply.time), "shortTime")}
                      </span>
                    </div>
                  </div>
                </div>
                {(reply.from == sess._id || status.from == sess._id) && (
                  <div className="col-md-1 col-sm-1 col-xs-1 colPadZero">
                    {/* <a ng-confirm-click="Are you sure to delete this reply?"
                confirmed-click="removeReply(reply, status)"><i className="fa fa-times"
                  style={{ float: 'right', marginRight: '7px', marginTop: '4px' }}></i></a> */}
                  </div>
                )}
                <br />
                <div className="col-md-2 col-sm-2 col-xs-2 colPadZero"></div>
                <div
                  className="col-md-9 col-sm-9 col-xs-9 colPadZero"
                  style={{ borderLeft: "3px solid #000" }}
                >
                  <div className="col-md-2 col-sm-2 col-xs-2 colPadZero"></div>
                  {reply.reply_type == "text" && (
                    <div
                      className="col-md-9 col-sm-9 col-xs-9 event-heading-convers"
                      style={{
                        fontSize: "1.1em",
                        padding: "2px",
                        textAlign: "left",
                        whiteSpace: "normal",
                      }}
                    >
                      <p style={{ marginBottom: 0 }}>{reply.message}</p>
                      <Link
                        to=""
                        className="status-update-like"
                        style={{ margin: "2px" }}
                      >
                        <i
                          className={
                            reply.likes.length > 0
                              ? "status-update-box-liked fa fa-heart"
                              : "fa fa-heart"
                          }
                          onClick={() => addLikeToStatusOrReply(status, reply)}
                          aria-hidden="true"
                        />
                        {reply.likes.length > 0 && (
                          <span
                            onClick={() => showsLikesList(reply.likes)}
                            aria-hidden="true"
                          >
                            {reply.likes.length}
                          </span>
                        )}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
