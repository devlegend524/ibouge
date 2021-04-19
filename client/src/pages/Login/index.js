import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Redirect, useHistory, useLocation} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {useFormik} from 'formik';
// import { registerSchema } from './validation';

import SocialAuth from '../../components/SocialAuth';
import {InputControl} from '../../components/Inputs';
import Footer from '../../components/Footer';

import {setTitle} from '../../actions/commonAction';

import {
  loginUserWithEmail,
  activeUser,
  toggleRememberMe,
} from '../../actions/authActions';

import {loginSchema} from './validation';
import './styles.scss';

import logo from '../../assets/img/ibouge-logo.png';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const errors = useSelector((state) => state.errors);
  const [rememberMeChkBx, setRememberMeChkBx] = useState(false);
  const [remember_me, setRemember_me] = useCookies('remember_me');
  const query = useQuery();
  const [token] = useState(query.get('token'));

  useEffect(() => {
    if (token) dispatch(activeUser(token, history));
  }, [token, dispatch, history]);

  useEffect(() => {
    dispatch(setTitle('Log In'));
  }, []);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginUserWithEmail(values, history));
    },
  });

  const changeRememberMeChkBx = () => {
    let date = new Date();
    if (!rememberMeChkBx) {
      setRemember_me(date.getTime().toString());
    } else {
      setRemember_me(undefined);
    }
    setRememberMeChkBx(!rememberMeChkBx);
    dispatch(toggleRememberMe(remember_me));
  };

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <>
      <div className="login">
        <section className="content-area">
          <div className="container-fluid containerWidth">
            <div className="row">
              <div className="col-md-4 col-sm-4 col-12 text-center"></div>
              <div className="col-md-4 col-sm-4 col-12 text-center">
                <img src={logo} className="login-logo" alt="logo" />
                <h4 className="login-greeting">
                  Welcome! Log in to your account
                </h4>
                <div className="login-box">
                  {errors.user_login && (
                    <span className="login-error-msg">{errors.user_login}</span>
                  )}
                  <SocialAuth />
                  <span className="login-seperator-txt">Or</span>
                  <form name="loginForm" onSubmit={formik.handleSubmit}>
                    <InputControl
                      placeholder="Email"
                      name="email"
                      nid="exampleInputEmail3"
                      handle={formik}
                    />
                    <InputControl
                      placeholder="Password"
                      name="password"
                      nid="exampleInputPassword3"
                      type="password"
                      handle={formik}
                    />
                    <div className="form-inline">
                      <div className="checkbox checkbox-success form-btn-left">
                        <input
                          id="checkbox1"
                          className="styled"
                          type="checkbox"
                          onChange={() => changeRememberMeChkBx()}
                          value={rememberMeChkBx}
                        />
                        <label htmlFor="checkbox1">Remember me</label>
                      </div>
                      <div className="checkbox checkbox-success form-btn-right">
                        <Link to="/restorepassword" className="forgot-pwd">
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary login-submit-btn"
                    >
                      LOG IN TO MY ACCOUNT
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-12 text-right">
                <span className="login-signup">Don't have an account?</span>
                <Link to="/register">
                  <button type="button" className="btn btn-default">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Login;
