var express = require('express');
var mailer = require('../services/mailer.js');
var router = express.Router();

// if the router gets 'events/allEvents
router.post('/sendContactEmail', function(req, res) {

  // try to get all users events from the database
  // if successful, send them back to user
  try {
    console.log('sendEmail: req.body.email is', req.body.email);
    from = req.body.name = "<" + req.body.email + ">";
    body = 'Email from ' + from + ':\n\n' + req.body.body;
    mailer.sendMail(mailer.supportAddress, mailer.supportAddress, req.body.subject, body, 0).then(function() {
      res.status(200).send('Email sent');
    }, function(e) {
      res.status(500).send("Couldn't send email: " + e);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
