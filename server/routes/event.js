var express = require('express');
var eventCtrl = require('../controllers/event');
var router = express.Router();
var formidable = require('formidable');

// Initializing Variables
var files_array  = [];
var expiryTime = 8;

// if the router gets 'events/allEvents
router.get('/allEvents', function(req, res) {

  // try to get all users events from the database
  // if successful, send them back to user
  try {
    eventCtrl.getAllEvents().then(function (events) {
      res.send(events);
    }, function (err) {
      res.status(err.status).send(err.message);
    });

    // else it failed so send error back to user
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

// route to get all events created by a particular person, given their userId
router.get('/:user', function(req, res) {
  try {
    eventCtrl.getUsersEvents(req.params.user).then(function(events) {
      res.send(events);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

// this will get the event clicked in the dashboard, to be displayed
router.get('/event-clicked/:eventId', function(req, res) {
  try {
    eventCtrl.getEventById(req.params.eventId).then(function(event) {
      res.send(event);
    }, function (err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

// this route is to create a new event, sending all the data required
router.post('/create', function(req, res) {
  //since we are receiving a formData we need to parse it formidable
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files) {

    var data = {
      albumName: fields.albumName,
      // file: files.file,
      userId: fields.userId,
      event: {
        address1: fields.address1,
        address2: fields.address2,
        category: fields.category,
        city: fields.city,
        coordinates: [fields.coordinates0, fields.coordinates1],
        country: fields.country,
        createdBy: fields.createdBy,
        date: fields.date,
        endTimeOfEvent: fields.endTimeOfEvent,
        eventDescription: fields.eventDescription,
        userGoing: fields.userId,
        confirmationDate: fields.confirmationDate,
        name: fields.name,
        startTimeOfEvent: fields.startTimeOfEvent,
        state: fields.state,
        zip: fields.zip
      }
    };

    if (files.file) {
      data.file = files.file
    }

    try {
        eventCtrl.createEvent(data).then(function(result) {
          res.send(result);
        }, function () {
          res.status(err.status).send(err.message);
        });
    } catch (e) {
      console.log('create event error: ', e);
      res.status(500).send('Internal server error');
    }
  });
});

module.exports = router;
