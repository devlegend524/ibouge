import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import Map from './map';
import {setProfile} from '../../actions/registerActions';
import './styles.scss';

const StepThree = (props) => {
  const dispatch = useDispatch();
  const [locations, setLocation] = useState({
    coordinates: [],
    bbox: [],
    addrs1: '',
    addrs2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
  });
  const history = useHistory();
  const handlePrevClick = () => {
    history.push('/profile_setup/step2');
  };
  const handleMapClicked = (newLocations) => {
    setLocation(newLocations);
  };
  const handleNextClick = () => {
    dispatch(
      setProfile({
        location: {
          ...locations,
        },
      })
    );
    history.push('/profile_setup/step4');
  };
  return (
    <div className="container containerWidth" ng-if="step == 'step2'">
      <div className="row">
        <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
        <div className="col-md-4 col-sm-4 col-12">
          <span className="profile-set-head">3/4 Setup your location</span>
          <h4 className="inner-subheadings">
            Add your location: Search on map
          </h4>
          <h5 style={{textAlign: 'center'}}>
            Please tag yourself somewhere in your neighbourhood so you can find
            people around you.
          </h5>

          <form>
            <div style={{width: '100%', height: '40%'}}>
              <Map
                width="100%"
                height="300px"
                saveSelection={handleMapClicked}
              />
            </div>
            <h5 className="text-danger text-center">
              {locations.city === '' ? 'Please select your location' : ''}
            </h5>
            <div className="row">
              <div className="col-md-6 col-sm-6 col-12">
                <button
                  type="button"
                  onClick={() => handlePrevClick()}
                  className="btn btn-default profinfo-submit-btn"
                  style={{width: '100%'}}
                >
                  BACK
                </button>
              </div>
              <div className="col-md-6 col-sm-6 col-12">
                <button
                  type="button"
                  onClick={() => handleNextClick()}
                  className="btn btn-primary profinfo-submit-btn"
                  style={{width: '100%'}}
                >
                  NEXT
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
      </div>
    </div>
  );
};

export default StepThree;
