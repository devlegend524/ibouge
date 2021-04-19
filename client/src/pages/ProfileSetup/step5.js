import React from 'react';
// import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import CheckoutForm from '../Payment';
import {Elements} from '@stripe/react-stripe-js';
import {stripePromise} from '../../constants';
const StepFive = (props) => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/');
  };
  const handlePrevClick = () => {
    history.push('/profile_setup/step3');
  };
  return (
    <div className="container containerWidth">
      <div className="row">
        <div className="col-md-4 col-sm-4 col-12 d-block d-sm-none"></div>
        <div className="col-md-4 col-sm-4 col-12">
          <span className="profile-set-head">Payment Method</span>
          <div style={{width: '100%'}}>
            <h4
              className="inner-subheadings-more"
              style={{marginBottom: '30px'}}
            >
              {' '}
              Only 10$/year for your Business
            </h4>
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
        <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
      </div>
    </div>
  );
};

export default StepFive;
