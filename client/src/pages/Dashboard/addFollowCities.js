import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./map_modals.scss";

const AddfollowCities = (props) => {
  const saveLocationToFollow = () => {};
  const changeCityToFollow = (city) => {};
  return (
    <>
      <button
        type="button"
        ng-click="$dismiss()"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <i
          className="fa fa-times-circle"
          style={{ fontSize: "30px", padding: "10px" }}
        ></i>
      </button>
      <div
        style={{
          height: "100%",
          width: "100%",
          lineHeight: "normal",
        }}
      >
        <div style={{ width: "100%", height: "85%", marginTop: "15%" }}>
          <div style={{ width: "94%", margin: "0 3% 0 3%" }}>
            <h2 align="center">Top Cities</h2>
            <h4 id="chooseLocationToChange" align="center">
              Choose up to three locations to follow for updates
            </h4>
            <h4 id="chooseLocationToChange" align="center">
              Select a city to update to new city
            </h4>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "large",
                color: "#f2b200",
              }}
            >
              <span
                id="extraCityToFollow0"
                className="hoverOver"
                onClick={changeCityToFollow("extraCityToFollow0")}
              >
                {props.citiesToFollow[0].cityName}
              </span>
              <br />

              <span
                id="extraCityToFollow1"
                className="hoverOver"
                onClick={changeCityToFollow("extraCityToFollow1")}
              >
                {props.citiesToFollow[1].cityName}
              </span>
              <br />

              <span
                id="extraCityToFollow2"
                className="hoverOver"
                onClick={changeCityToFollow("extraCityToFollow2")}
              >
                {props.citiesToFollow[2].cityName}
              </span>
            </div>

            <div
              id="followAnotherLocationMap"
              style={{ width: "100%", height: "300px", marginTop: "15px" }}
            ></div>
            <div>
              <h4 id="saveLocationToFollow" align="center">
                2. search for a city
              </h4>
            </div>
            <div
              id="followAnotherLocationGeocoder"
              style={{ width: "100%", height: "45px", marginTop: "10px" }}
            ></div>
            <button
              className="btn btn-primary ibg-btn ibg-btn-create"
              style={{
                width: "100%",
                height: "50px",
                background: "#6D00A2",
                fontSize: "large",
                color: "white",
                marginTop: "10px",
              }}
              onClick={saveLocationToFollow()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddfollowCities;
