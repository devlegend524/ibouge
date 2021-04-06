import React from 'react';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiaWJvdWdlIiwiYSI6ImNqY2wzaXJ5YTAycWIzM2pyb3JhN20yenkifQ.jhimhHWkb-6GD3Tq8bvCKA'
});

const LocationTab = () => {
  const updateAccountLocation = () => {}

  const navStyle = {
    position: 'absolute',
    bottom: 100,
    right: 0,
    padding: '10px'
  };

  return (
    <form action="profile_setup_step_three.html">
      <Map
        style="https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB"
        containerStyle={{
          height: '300px',
          width: '400px',
        }}
        zoom={[9]}
      >
        <div className="nav" style={navStyle}>
          <ZoomControl />
        </div>
      </Map>
      {/* <div id="geocoder" className="hidden"></div> */}
      {/* <p className="fadeOut"
        style={{ margin: '7px', color: '#07d326', fontSize: 'x-large' }}>
        Updated Successfully!
      </p> */}
      <div className="account action-container">
        <button type="button" onClick={() => updateAccountLocation()}
          className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad">
          SAVE
        </button>
        <button type="button"
          className="btn btn-primary chat-invite-purple-btn margin-btn">CANCEL</button>
      </div>
    </form>
  )
}

export default LocationTab
