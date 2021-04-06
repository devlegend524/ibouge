import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import StepOne from "./step1";
import StepTwo from "./step2";
import StepThree from "./step3";
import StepFour from "./step4";
import logo from "../../assets/img/ibouge-logo.png";

import "./styles.scss";
import { setTitle } from "../../actions/commonAction";

const ProfileSetup = (props) => {
  const param = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle(`ProfileSetup-${param.step}`));
  }, []);
  return (
    <section className="content-area">
      <div className="container containerWidth">
        <div className="row">
          <div className="com-md-4 col-sm-4 col-12"></div>
          <div className="com-md-4 col-sm-4 col-12">
            <img src={logo} className="login-logo" alt="logo" />
          </div>
          <div className="com-md-4 col-sm-4 col-12"></div>
        </div>
        {param.step === "step1" ? (
          <StepOne />
        ) : param.step === "step2" ? (
          <StepTwo />
        ) : param.step === "step3" ? (
          <StepThree />
        ) : (
          <StepFour />
        )}
      </div>
    </section>
  );
};

export default ProfileSetup;
