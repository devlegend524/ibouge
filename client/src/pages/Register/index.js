import React, {useEffect} from 'react';
import {Link, Redirect, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';

import SocialAuth from '../../components/SocialAuth';
import {InputControl, SelectControl} from '../../components/Inputs';
import Footer from '../../components/Footer';

import {setTitle} from '../../actions/commonAction';
import {
  registerUserWithEmail,
  registerResendEmail,
} from '../../actions/registerActions';

import {registerSchema} from './validation';
import {gender, dob} from './util';

import './styles.scss';

import logo from '../../assets/img/ibouge-logo.png';

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {error} = useSelector((state) => state.register);
  const auth = useSelector((state) => state.auth);
  const register = useSelector((state) => state.register);
  useEffect(() => {
    dispatch(setTitle('Register'));
  }, []);
  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      gender: '',
      mm: '',
      dd: '',
      yyyy: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      const data = {
        ...values,
        dob: new Date(values.yyyy + '-' + values.mm + '-' + values.dd),
      };
      dispatch(registerUserWithEmail(data));
      if (!error) history.push('/profile_setup/step1');
    },
  });

  const resendEmail = () => {
    dispatch(registerResendEmail({email: formik.values.email}));
  };

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <>
      <div className="register">
        <section className="content-area">
          <div className="container-fluid containerWidth">
            <div className="row">
              <div className="col-md-4 col-sm-3 col-12 text-center"></div>
              <div className="col-md-4 col-sm-5 col-12 text-center">
                <img src={logo} className="login-logo" alt="logo" />
                <h4 className="login-greeting">
                  Sign up in a few simple steps
                </h4>
                <div className="login-box">
                  {!register.isLoading && (
                    <>
                      {register.message && register.state === 'success' && (
                        <span className="login-success-msg">
                          {register.message}{' '}
                          <span onClick={resendEmail} aria-hidden="true">
                            Resend
                          </span>{' '}
                          link.
                        </span>
                      )}
                      {register.state === 'failure' && (
                        <>
                          {register.message ===
                          'Please check your email to validate your address.' ? (
                            <span className="login-error-msg">
                              {register.message}{' '}
                              <a onClick={resendEmail} aria-hidden="true">
                                Resend
                              </a>{' '}
                              email.
                            </span>
                          ) : (
                            <span className="login-error-msg">
                              {register.message}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                  <SocialAuth />
                  <span className="login-seperator-txt">Or</span>
                  <form name="registerForm" onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-wrap col-md-12 col-sm-12 col-12 padding-zero">
                      <div className="col-md-6 col-sm-6 col-12 padding-zero padding-left-zero">
                        <InputControl
                          placeholder="First Name"
                          name="fname"
                          nid="exampleInputName1"
                          handle={formik}
                        />
                      </div>
                      <div className="col-md-6 col-sm-6 col-12 padding-zero padding-right-zero">
                        <InputControl
                          placeholder="Last Name"
                          name="lname"
                          nid="exampleInputName2"
                          handle={formik}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-wrap col-md-12 col-sm-12 col-12 padding-zero">
                      <div className="col-md-6 col-sm-6 col-12 padding-zero padding-left-zero">
                        <SelectControl name="gender" handle={formik}>
                          {gender.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </SelectControl>
                      </div>
                      <div className="col-md-6 col-sm-6 col-12 padding-zero padding-right-zero">
                        <div
                          className="btn-group grp-width"
                          role="group"
                          aria-label="age"
                        >
                          <div
                            className="btn-group signup-width-left"
                            role="group"
                          >
                            <SelectControl name="mm" handle={formik}>
                              {dob.mm.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </SelectControl>
                          </div>
                          <div
                            className="btn-group signup-width-mid"
                            role="group"
                          >
                            <SelectControl name="dd" handle={formik}>
                              {dob.dd.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </SelectControl>
                          </div>
                          <div
                            className="btn-group signup-width-right"
                            role="group"
                          >
                            <SelectControl name="yyyy" handle={formik}>
                              {dob.yyyy.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </SelectControl>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <InputControl
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      nid="exampleInputConfirmPassword3"
                      type="password"
                      handle={formik}
                    />
                    {formik.errors && (
                      <span className="login-error-msg">
                        {formik.errors.confirmPassword}
                      </span>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary login-submit-btn"
                      disabled={!formik.isValid}
                    >
                      CREATE MY ACCOUNT
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-12 text-right">
                <span className="login-signup">Already have an account?</span>
                <Link to="/login">
                  <button type="button" className="btn btn-default">
                    Sign In
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

export default Register;
