import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

// import { getUsers } from '../..//actions/userActions';
import Layout from "layout";
import Loader from "../../components/Loader";
import requireAuth from "../../hoc/requireAuth";

import "./styles.scss";

const Users = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);

  // useEffect(() => dispatch(getUsers()), []);

  return (
    <Layout>
      <div className="users">
        <h1>Users page</h1>
        <p>
          This is the Users page. Here are listed all of the users of the app.
          Click the avatar or the username link to go to user's profile. Only
          authenticated users can see this page.
        </p>
        <div className="list">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {users.map((user, index) => {
                return (
                  <div key={index} className="profile">
                    <Link to={`/${user.username}`}>
                      <img src={user.avatar} className="avatar" alt="avatar" />
                    </Link>
                    <div className="info-container">
                      <div>
                        <span className="label">Provider: </span>
                        <span className="info">{user.provider}</span>
                      </div>
                      <div>
                        <span className="label">Role: </span>
                        <span className="info">{user.role}</span>
                      </div>
                      <div>
                        <span className="label">Name: </span>
                        <span className="info">{user.name}</span>
                      </div>
                      <div>
                        <span className="label">Username: </span>
                        <Link
                          to={`/${user.username}`}
                          className="info bold profile-link"
                        >
                          {user.username}
                        </Link>
                      </div>
                      <div>
                        <span className="label">Email: </span>
                        <span className="info">{user.email}</span>
                      </div>
                      <div>
                        <span className="label">Joined: </span>
                        <span className="info">
                          {moment(user.createdAt).format(
                            "dddd, MMMM Do YYYY, H:mm:ss"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default requireAuth(Users);
