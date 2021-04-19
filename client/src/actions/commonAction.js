import {SET_PAGE_TITLE} from './action_types/common';

export const setTitle = (payload) => ({
  type: SET_PAGE_TITLE,
  payload,
});
