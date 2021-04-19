// event model

var mongoose = require('mongoose');

var location = new mongoose.Schema({
  address1: String,
  address2: String,
  country: String,
  state: String,
  city: String,
  zip: String,
  coordinates: Array,
});

var likes = new mongoose.Schema({
  user: String,
  date: Date,
});
var going = new mongoose.Schema({
  userId: String,
  confirmationDate: Date,
});

var eventSchema = new mongoose.Schema({
  createdBy: String,
  createdDate: Date,
  name: String,
  category: String,
  dateOfEvent: Date,
  eventStartTime: String,
  eventEndTime: String,
  description: String,
  location: location,
  eventImage: String,
  likes: [likes],
  going: [going],
});

eventSchema.methods.getJSON = function () {
  var newEvent = {
    _id: this._id,
    createdBy: this.createdBy,
    createdDate: this.createdDate,
    name: this.name,
    category: this.category,
    dateOfEvent: this.dateOfEvent,
    eventStartTime: this.eventStartTime,
    eventEndTime: this.eventEndTime,
    description: this.description,
    location: this.location,
    eventImage: this.eventImage,
    likes: this.likes,
    going: this.going,
  };

  return newEvent;
};

mongoose.model('Event', eventSchema);
