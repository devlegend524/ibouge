import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { setTitle }  from '../../actions/commonAction'
import { newPassword }  from '../../actions/newpasswordAction'

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const NewPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const newpasswordState = useSelector(state => state.newpassword);
  const [token] = useState(query.get('token'));
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  
  useEffect(() => {
    dispatch(setTitle('New Password'))
  }, []);

  const handleSubmit = e => {
    dispatch(newPassword({
      email: userEmail,
      password: userPassword,
      token: token
    }))
  }
  if (newpasswordState.status) {
    window.setTimeOut(() => {
      return <Redirect to="/login" />
    }, 1000)
  }
  return (
  <section className="content-area">
    <div className="container containerWidth">
      <div className="row">
        <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
        <div className="col-md-4 col-sm-4 col-12 text-center">
          <img src="img/ibouge-logo.png" className="login-logo" alt="logo" />
          <h4 className="login-greeting">Please enter your new password.</h4>
          <div className="login-box">
            <span className={newpasswordState.status? "login-success-msg" : "login-error-msg"} >{newpasswordState.message}</span>
            <form onSubmit={e => handleSubmit(e)}>
              <div className="form-group">
                <label className="sr-only" htmlFor="exampleInputEmail3">Email address</label>
                <input type="email" value={userEmail} className="form-control" id="exampleInputEmail3"
                  placeholder="Email" onChange={e => setUserEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="exampleInputPassword3">Password</label>
                <input type="password" value={userPassword} className="form-control"
                  id="exampleInputPassword3" placeholder="Password" onChange={e => setUserPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary login-submit-btn">CREATE NEW PASSWORD</button>
            </form>
          </div>
        </div>
        <div className="col-md-4 col-sm-4 col-12 text-right">
          <span className="login-signup">Don't have an account?</span>
          <Link to="register"><button type="button"
              className="btn btn-default">Sign Up</button></Link>
        </div>
      </div>
    </div>
  </section>
  )
}

export default NewPassword;
