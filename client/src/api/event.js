import axios from 'axios';

export const getAllEvents = () => {
  return axios.get('/event/allEvents');
};

export const getMyEvents = (_id) => {
  return axios.get(`/event/${_id}`);
};

export const getEventClicked = (data) => {
  return axios.get(`/event/event-clicked/${data}`);
};

export const createEvent = (file, data) => {
  if (data) {
    var albumName = 'events-image';

    // here we create a new formData since we are sending a file through an http request
    var fd = new FormData();

    // we append to the formData the file itself it it exists, the albumName, userId and all of the event properties
    if (file) {
      fd.append('file', file);
    }
    fd.append('albumName', albumName);
    fd.append('userId', data.createdBy);
    fd.append('address1', data.address1);
    fd.append('address2', data.address2);
    fd.append('category', data.category);
    fd.append('city', data.city);
    fd.append('coordinates0', data.coordinates[0]);
    fd.append('coordinates1', data.coordinates[1]);
    fd.append('country', data.country);
    fd.append('createdBy', data.createdBy);
    fd.append('date', data.date);
    fd.append('endTimeOfEvent', data.endTimeOfEvent);
    fd.append('eventDescription', data.eventDescription);
    fd.append('userGoing', data.going.userGoing);
    fd.append('confirmationDate', data.going.confirmationDate);
    fd.append('name', data.name);
    fd.append('startTimeOfEvent', data.startTimeOfEvent);
    fd.append('state', data.state);
    fd.append('zip', data.zip);

    return axios.post('/event/create', fd);
  }
};
