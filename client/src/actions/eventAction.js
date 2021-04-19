import {
  GET_EVENTS_LOADING,
  CREATE_EVENTS_LOADING,
  GET_MY_EVENTS_LOADING,
  ADD_EVENT_LIKE,
} from './action_types/event';

export const getAllEvents = () => ({type: GET_EVENTS_LOADING});
export const createEvent = (payload) => ({
  type: CREATE_EVENTS_LOADING,
  payload,
});
export const addEventLike = (payload) => ({
  type: ADD_EVENT_LIKE,
  payload,
});
