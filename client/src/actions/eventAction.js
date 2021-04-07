import {GET_EVENTS_LOADING, CREATE_EVENTS_LOADING} from './action_types/event';

export const getAllEvents = () => ({type: GET_EVENTS_LOADING});
export const createEvent = (payload) => ({
  type: CREATE_EVENTS_LOADING,
  payload,
});
