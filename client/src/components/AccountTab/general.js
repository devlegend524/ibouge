import React from 'react';
import {useSelector} from 'react-redux';
import {useFormik} from 'formik';
import {SelectControl, InputForControl} from '../Inputs';
import {gender, dob} from '../../pages/Register/util';
import './styles.scss';

const GeneralTab = () => {
  const auth = useSelector((state) => state.auth.sess);
  const formik = useFormik({
    initialValues: {
      fname: auth.fname,
      lname: auth.lname,
      gender: auth.gender,
      mm: auth.mm,
      dd: auth.dd,
      yyyy: auth.yyyy,
      email: auth.email,
      password: '',
      confirmPassword: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <form className="tab-sett-frm-pad">
      <div className="col-md-12 col-sm-12 col-xs-12 padding-zero">
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-left-zero">
          <div className="form-group">
            <label htmlFor="fname">First Name</label>
            <input
              id="fname"
              placeholder="First Name"
              required="required"
              name="fname"
              className="form-control tab-inputarea-style"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values['fname']}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-right-zero">
          <div className="form-group">
            <label htmlFor="fname">Last Name</label>
            <input
              id="lname"
              placeholder="Last Name"
              required="required"
              name="lname"
              className="form-control tab-inputarea-style"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values['lname']}
            />
          </div>
        </div>
      </div>
      <div className="col-md-12 col-sm-12 col-xs-12 padding-zero">
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-left-zero">
          <div className="form-group">
            <select
              className="form-control"
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values['gender']}
            >
              {gender.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}{' '}
            </select>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-right-zero">
          <div className="btn-group grp-width">
            <div className="btn-group signup-width-left">
              <SelectControl name="mm" handle={formik}>
                {dob.mm.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectControl>
            </div>
            <div className="btn-group signup-width-mid">
              <SelectControl name="dd" handle={formik}>
                {dob.dd.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </SelectControl>
            </div>
            <div className="btn-group signup-width-right">
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

      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          placeholder="Email"
          required="required"
          name="lname"
          className="form-control"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values['email']}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="Password"
          required="required"
          name="password"
          className="form-control"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values['password']}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Repeat Password</label>
        <input
          id="confirmPassword"
          placeholder="Repeat Password"
          required="required"
          name="confirmPassword"
          className="form-control"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values['confirmPassword']}
        />
      </div>
      <div className="account action-container">
        <button
          type="submit"
          className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
        >
          SAVE
        </button>
        <button
          type="reset"
          className="btn btn-primary chat-invite-purple-btn margin-btn"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default GeneralTab;
