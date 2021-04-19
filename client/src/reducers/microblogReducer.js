import {
  GET_MICROBLOGS_SUCCESS,
  CREATE_MICROBLOG_SUCCESS,
} from '../actions/action_types/microblog';

const initialState = {
  blogs: [],
  isLoading: false,
};

const microblogReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_MICROBLOGS_SUCCESS:
      return {
        ...state,
        blogs: payload,
      };
    case CREATE_MICROBLOG_SUCCESS:
      return {
        ...state,
        blogs: payload,
      };
    default:
      return state;
  }
};
export default microblogReducer;
