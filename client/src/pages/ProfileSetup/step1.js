import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import RadioButton from '../../components/RadioButton'
import { setProfile  } from '../../actions/registerActions'
import './styles.scss'; 

const StepOne = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const defaultType = useSelector(state => state.register.account_type)
  const [accountType, setType] = useState(defaultType);
  
  const handleClick = () => {
    dispatch(setProfile({account_type: accountType}));
    history.push('/profile_setup/step2')
  }

  return (
    <div className="row">
      <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
      <div className="col-md-4 col-sm-4 col-12 text-center">
        <span className="login-greeting">1/4 Choose your Account Type</span>
        <form>
          <div className="radioOption kids row">
            <RadioButton 
              radio_name="account_type"
              radio_value="1"
              onChange={e => setType(e.target.value)}
              label="Business Account"
              checked={accountType}
            />
            <RadioButton 
              radio_name="account_type"
              radio_value="0"
              onChange={e => setType(e.target.value)}
              label="Personal Account"
              checked={accountType}
            />
          </div>
          <button type="button" onClick={() => handleClick()} className="btn btn-primary profinfo-submit-btn"
            style={{ width: '100%' }}>NEXT</button>
        </form>
      </div>
      <div className="col-md-4 col-sm-4 col-12 text-center d-block d-sm-none"></div>
    </div>
  )
}

export default StepOne
