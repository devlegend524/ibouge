var express = require('express');
var microblogCtrl = require('../controllers/microblog');
var notificationCtrl = require('../controllers/notification');
var util = require('../services/util');
var router = express.Router();
var formidable = require('formidable');


// Initializing Variables
var files_array  = [];
var expiryTime = 8;

router.get('/history/:room', function(req, res) {
  try {
    microblogCtrl.getMicroblogHistory(req.params.room, req.query.limit, req.query.offset).then(function(microblog) {
      res.send(microblog.messages);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.get('/allmicroblogs', function(req, res) {
  try {
    microblogCtrl.getMicroblogs().then(function(microblogs) {
      res.send(microblogs);
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

// router.get('/group/', function(req, res) {
//   try {
//     chatCtrl.getGroupChatsByCreatedBy(req.query.id, ['room', 'created_date', 'name', 'users']).then(function(chats) {
//       res.send(chats);
//     }, function(err) {
//       res.status(err.status).send(err.message);
//     });
//   } catch (e) {
//     res.status(500).send('Internal server error');
//   }
// });

router.get('/:room', function(req, res) {
  try {
    microblogCtrl.getMicroblogByRoom(req.params.room).then(function(microblog) {
      var clonedMicroblog = microblog.getJSON();
      microblogCtrl._getMicroblogMeta(microblog).then(function(meta) {
        var users = meta.users;
        clonedMicroblog.users = clonedMicroblog.users.map(function(user) {
          for (var n = 0; n < users.length; n++) {
            if (users[n]._id == user.user_id) {
              user.fname = users[n].fname;
              user.lname = users[n].lname;
              user.profile_pic = users[n].profile_pic;
              return user;
            }
          }
        });
        res.send(clonedMicroblog);
      }, function(err) {
        res.status(err.status).send(err.message);
      });
    }, function(err) {
      res.status(err.status).send(err.message);
    });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/', function(req, res) {

  // since we are receiving a formData for we need to parse it with formidable
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var data = {
      userId: fields.userId,
      users: fields.users,
      room: fields.room,
      isMicroblog: fields.isMicroblog,
      name: fields.microblogName,
      albumName: fields.albumName,
      coordinates: [fields.coordinates0, fields.coordinates1]
    };

    if (files.file) {
      data.file = files.file;
    }

    try {
      microblogCtrl.createMicroblog(data).then(function(result) {
        var clonedMicroblog = result.microblog.getJSON();
        var users = result.users;
        // notificationCtrl.addNotification('create-microblog', result.microblog);

        clonedMicroblog.users = clonedMicroblog.users.map(function(user) {
          for (var n = 0; n < users.length; n++) {
            if (users[n]._id == user.user_id) {
              user.fname = users[n].fname;
              user.lname = users[n].lname;
              user.profile_pic = users[n].profile_pic;
              return user;
            }
          }
        });
        res.send(clonedMicroblog);
      }, function() {
        res.status(err.status).send(err.message);
      });
    } catch (e) {
      // console.log('create microblog error: ', e);
      res.status(500).send('Internal server error');
    }
  });
});

router.post('/microblogpic/:room', function(req, res) {
  microblogCtrl.updateMicroblogPic(req.params.room, req.body).then(function(microblog) {
    res.send(microblog.microblog_img);
  }, function(err) {
    res.send(err);
  });
});

// route for uploading images asynchronously
router.post('/upload-image-message',function (req, res) {
  // var imgdatetimenow = Date.now();
  var form = new formidable.IncomingForm();

  form.parse(req,function(err,fields,files) {

    var data = {
      albumName: fields.albumName,
      file: files.file,
      microblogRoom: fields.microblogRoom,
      message_type: fields.message_type,
      message: fields.message,
      from : fields.from
    };

    try {
      microblogCtrl.saveImageMessage(data).then(function (response) {
        res.send(response);
      }, function (err) {
        res.send(err);
      });
    } catch (e) {
      console.log('create event error: ', e);
      res.status(500).send('Internal server error');
    }
  });
});

router.post('/notification', function(req, res) {
  var data = {
    microblog: req.body.microblog,
    friends: req.body.friends
  };
  notificationCtrl.addNotification('invite-friend-to-microblog', data);
  res.send('Successfully sent invitation to microblog');
});

router.post('/remove-user', function(req, res) {
  microblogCtrl.removeMicroblogUser(req.body.user, req.body.room).then(function() {
    res.send('Succesfully removed user from microblog');
  }, function(err) {
    res.send(err);
  });
});

module.exports = router;
