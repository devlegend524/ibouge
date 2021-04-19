import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Blog from '../../components/Blog';
import * as MicroblogAPI from '../../api/microblog';

import useSocket from 'use-socket.io-client';
import {socketUrl} from '../../constants';
import defaultImg from '../../assets/img/event-icon.png';
const BlogList = (props) => {
  const auth = useSelector((state) => state.auth);
  const [microBlog, setMicroBlog] = useState(null);
  const [open, setOpen] = useState(false);
  const [socket] = useSocket(socketUrl);
  socket.connect();
  useEffect(() => {
    let interval = setInterval(function () {
      if (auth.sess) {
        socket.emit('addUserID', {
          id: auth.sess._id,
        });
        clearInterval(interval);
      }
    }, 3000);
    return () => {
      setOpen(false);
    };
  }, []);
  const openMicroblog = (blog) => {
    const data = {
      user: auth.sess._id,
      room: blog.properties.room,
    };
    socket.emit('add-me-to-allInvolved', data);

    MicroblogAPI.getMicroblog(auth.sess._id, blog.properties.room)
      .then((res) => {
        setMicroBlog(res.data);
        if (res.data) {
          setOpen(true);
        }
      })
      .catch((err) => console.log('========', err));
  };
  const closeMicroBlog = () => {
    setOpen(false);
  };
  return (
    <>
      <h2 className="amount-of-microblogs">{props.data?.length} Microblogs</h2>
      {props.data &&
        props.data.map((blog, index) => (
          <div
            className="events-wrap-view"
            onClick={(e) => openMicroblog(blog)}
            style={{cursor: 'pointer'}}
            key={index}
          >
            <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
              <img
                src={
                  blog.properties.microblogImg
                    ? blog.properties.microblogImg
                    : defaultImg
                }
                className="img-of-creator"
                alt="creator"
              />
            </div>
            <div className="col-md-7 col-sm-7 col-xs-7 colPadZero">
              <div className="name-of-microblog">
                <span>{blog.properties.name}</span>
              </div>
              <div className="amount-of-users">
                <a href="" className="microblog-box-users microblog-users">
                  <i className="fa fa-user" aria-hidden="true"></i>
                  <span>{blog.properties.users.length}</span>
                </a>
                <span>{blog.properties.created_date}</span>
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
      {open && (
        <Blog open={open} closeHandler={closeMicroBlog} data={microBlog} />
      )}
    </>
  );
};

export default BlogList;
