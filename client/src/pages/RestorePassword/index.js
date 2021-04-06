import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import { resetPassword, setRestoreEmail }  from '../../actions/authActions'
import { setTitle }  from '../../actions/commonAction'

const RestorePassword = () => {
  const dispatch = useDispatch();
  const resetPasswordState = useSelector(state => state.resetpassword);
  const [restoreEmail, setRestoreEmailState] = useState('');
  useEffect(() => {
    dispatch(setTitle('Restore Password'))
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setRestoreEmail(restoreEmail));
    dispatch(resetPassword(restoreEmail));
  }
  return (
    <section className="content-area">
      <div className="container containerWidth">
        <div className="row">
          <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
          <div className="col-md-4 col-sm-4 col-12 text-center">
            <img src="img/ibouge-logo.png" className="login-logo" alt="logo" />
            <h4 className="login-greeting">Restore your password</h4>
            <span className="login-greeting-sub-head">Enter your email address and we'll get you back on track.</span>
            <div className="login-box">
              <span className={resetPasswordState.status ? 'login-success-msg' : 'login-error-msg' } >{ resetPasswordState.message }</span>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group">
                  <label className="sr-only" htmlFor="exampleInputEmail3">Email address</label>
                  <input type="email" className="form-control" id="exampleInputEmail3"
                    value={restoreEmail}
                    onChange={e => setRestoreEmailState(e.target.value) }
                    placeholder="Email" required />
                </div>
                <button type="submit" className="btn btn-primary login-submit-btn">RESTORE PASSWORD</button>
              </form>
            </div>
            <Link to="login" className="home-link" >Go back to Login</Link>
          </div>
          <div className="col-md-4 col-sm-4 col-12 text-right">
            <span className="login-signup">Don't have an account?</span>
            <Link to="register"><button type="button"
                className="btn btn-default">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RestorePassword;
