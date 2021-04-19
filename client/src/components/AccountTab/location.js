import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {MapContainer, TileLayer} from 'react-leaflet';
import GeoCoder from '../../components/GeoCoder';
import {setProfile} from '../../actions/registerActions';

const LocationTab = () => {
  const user = useSelector((state) => state.auth.sess);
  const dispatch = useDispatch();
  const [userLocations, setUserLocation] = useState({
    coordinates: [],
    bbox: [],
    addrs1: '',
    addrs2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
  });

  const updateAccountLocation = () => {
    if (userLocations.coordinates.length > 0) {
      dispatch(
        setProfile({
          location: {
            ...userLocations,
          },
        })
      );
    }
  };

  const handleUpdateCity = (data) => {
    console.log(data);
    setUserLocation({
      coordinates: [data.geocode.center.lat, data.geocode.center.lng],
      bbox: data.properties?.boundingbox,
      addrs1: data.properties?.address?.town,
      addrs2: data.properties?.address?.county,
      country: data.properties?.address?.country,
      state: data.properties?.address?.state,
      city: data.properties?.address?.town,
      zip: data.properties?.address?.country_code,
    });
  };
  return (
    <form action="profile_setup_step_three.html">
      {/* <div id="geocoder" className="hidden"></div> */}
      {/* <p className="fadeOut"
        style={{ margin: '7px', color: '#07d326', fontSize: 'x-large' }}>
        Updated Successfully!
      </p> */}
      <div className="account action-container">
        <MapContainer
          style={{height: '300px', width: '100%'}}
          zoom={9}
          zoomControl={false}
          center={user.location.coordinates}
        >
          <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoCoder handleSearch={handleUpdateCity} />
        </MapContainer>
        <button
          type="button"
          onClick={() => updateAccountLocation()}
          className="btn btn-primary chat-invite-orange-btn margin-btn tab-sett-btn-pad"
        >
          SAVE
        </button>
        <button
          type="button"
          className="btn btn-primary chat-invite-purple-btn margin-btn"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default LocationTab;
