var express = require('express');
var statusCtrl = require('../controllers/status.js');
var router = express.Router();
var formidable = require('formidable');

// Initializing Variables
var files_array  = [];
var expiryTime = 8;

router.get('/getStatus', function(req, res) {
  try {
    statusCtrl.getStatusUpdates().then(function(statuses) {
      res.send(statuses);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/new-status', function(req, res) {
  try {
    statusCtrl.createNewStatus(req.body.from, req.body.status_type, req.body.message, req.body.time, req.body.size, req.body.filename, req.body.caption, req.body.likes).then(function(status) {
      res.send(status);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    console.log('create new status err: ', e);
    res.status(500).send('Internal server error');
  }
});

router.post('/delete-status', function(req, res) {
  if (req.session.user != req.body.from) {
    return res.status(401).send('Unauthorized operation!');
  }
  try {
    statusCtrl.deleteStatus(req.body.id, req.body.from).then(function(status) {
      res.send(status);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    console.log('delete status err: ', e);
    res.status(500).send('Internal server error');
  }
});

router.post('/delete-reply', function(req, res) {
  try {
    statusCtrl.deleteReply(req.body.reply_id, req.body.status_id).then(function(status) {
      res.send(status);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    console.log('delete status err: ', e);
    res.status(500).send('Internal server error');
  }
});

router.post ('/image-status', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files) {
    var data = {
      albumName: fields.albumName,
      file: files.file,
      userId: fields.userId,
      message: fields.message,
      status_type: fields.status_type,
      time: fields.time
    };

    try {
      statusCtrl.uploadDataToBucketAndCreateStatus(data).then(function(response) {
        res.send(response);
      }, function (err) {
        res.status(err.status).send(err.message);
      });
    } catch (e) {
      console.log('save image to album err: ', e);
      res.status(500).send('Internal server error');
    }
  });
});

router.post ('/upload-image', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files) {
    var data = {
      albumName: fields.albumName,
      file: files.file,
      userId: fields.userId,
      message: fields.message,
      status_type: fields.status_type,
      time: fields.time
    };

    try {
      statusCtrl.uploadDataToBucket(data).then(function(response) {
        res.send(response);
      }, function (err) {
        res.status(err.status).send(err.message);
      });
    } catch (e) {
      console.log('save image to album err: ', e);
      res.status(500).send('Internal server error');
    }
  });
});

module.exports = router;
