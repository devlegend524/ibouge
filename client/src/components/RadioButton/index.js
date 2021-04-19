import React from 'react';
import {PropTypes} from 'prop-types';

function RadioButton(props) {
  return (
    <div className="position-relative">
      <label className="status">
        <input
          type="radio"
          name={props.radio_name}
          value={props.radio_value}
          onChange={props.onChange}
          checked={props.checked === props.radio_value ? 'checked' : ''}
        />
        <span className="checkmark">{props.label}</span>
      </label>
    </div>
  );
}
RadioButton.propTypes = {
  radio_name: PropTypes.string.isRequired,
  radio_value: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
};
export default RadioButton;
