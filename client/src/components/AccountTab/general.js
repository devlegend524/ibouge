import React from 'react';
import { useFormik } from 'formik';
import { SelectControl, InputForControl } from '../Inputs';
import { gender, dob } from '../../pages/Register/util';
import './styles.scss';  

const GeneralTab = () => {
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
    onSubmit: (values) => {}
  });

  return (
    <form className="tab-sett-frm-pad">
      <div className="col-md-12 col-sm-12 col-xs-12 padding-zero">
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-left-zero">
          <InputForControl
            placeholder="First Name"
            text="First Name"
            size="1.2em"
            name="fname"
            nid="exampleInputName1"
            handle={formik}
            customClass="tab-inputarea-style"
          />
        </div>
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-right-zero">
          <InputForControl
            placeholder="Last Name"
            text="Last Name"
            size="1.2em"
            name="lname"
            nid="exampleInputName2"
            handle={formik}
            customClass="tab-inputarea-style"
          />
        </div>
      </div>
      <div className="col-md-12 col-sm-12 col-xs-12 padding-zero">
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-left-zero">
          <SelectControl name="gender" handle={formik}>
            {gender.map((item, index) => (<option key={index} value={item.id}>{item.name}</option>))}
          </SelectControl>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-12 padding-zero padding-right-zero">
          <div className="btn-group grp-width">
            <div className="btn-group signup-width-left">
              <SelectControl name="mm" handle={formik}>
                {dob.mm.map((item, index) => (<option key={index} value={item.id}>{item.name}</option>))}
              </SelectControl>
            </div>
            <div className="btn-group signup-width-mid">
              <SelectControl name="dd" handle={formik}>
                {dob.dd.map((item, index) => (<option key={index} value={item}>{item}</option>))}
              </SelectControl>
            </div>
            <div className="btn-group signup-width-right">
              <SelectControl name="yyyy" handle={formik}>
                {dob.yyyy.map((item, index) => (<option key={index} value={item}>{item}</option>))}
              </SelectControl>
            </div>
          </div>
        </div>
      </div>
      <InputForControl
        placeholder="Email"
        text="Email address"
        size="1.2em"
        name="email"
        nid="exampleInputEmail3"
        handle={formik}
      />
      <InputForControl
        placeholder="Password"
        text="Password"
        name="password"
        size="1.2em"
        nid="exampleInputPassword3"
        type="password"
        handle={formik}
      />
      <InputForControl
        placeholder="Password"
        text="Repeat Password"
        name="confirmPassword"
        size="1.2em"
        nid="exampleInputConfirmPassword3"
        type="password"
        handle={formik}
      />
      <div className="account action-container">
        <button
          type="submit"
          className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
        >
          SAVE
        </button>
        <button
          type="submit"
          className="btn btn-primary chat-invite-purple-btn margin-btn"
        >
          CANCEL
        </button>
      </div>
    </form>
  )
}

export default GeneralTab
