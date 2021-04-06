import {
  GET_MICROBLOGS_FAILED,
  GET_MICROBLOGS_SUCCESS,
} from "../actions/action_types/microblog";

const initialState = {
  blogs: [],
  isLoading: false,
  error: null,
};

const microblogReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MICROBLOGS_SUCCESS:
      return {
        ...state,
        blogs: payload,
      };
    case GET_MICROBLOGS_FAILED:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};
export default microblogReducer;
