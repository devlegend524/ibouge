import {SET_PAGE_TITLE} from '../actions/action_types/common';

const initialState = {
  title: null,
  appLoaded: false,
};

const commomReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_PAGE_TITLE:
      return {
        ...state,
        title: payload,
      };
    default:
      return state;
  }
};
export default commomReducer;
