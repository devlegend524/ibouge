var express = require("express");
var chatCtrl = require("../controllers/chat");
var notificationCtrl = require("../controllers/notification");
var util = require("../services/util");
var router = express.Router();
var formidable = require("formidable");

// Initializing Variables
var files_array = [];
var expiryTime = 8;

router.get("/history/:room", function (req, res) {
  try {
    chatCtrl.getHistory(req.params.room, req.query.limit, req.query.offset).then(
      function (chat) {
        res.send(chat.messages);
      },
      function (err) {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

router.get("/read/:room", function (req, res) {
  try {
    chatCtrl.updateLastMessage(req.params.room).then(
      function (chat) {
        res.send({ success: true });
      },
      function (err) {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

router.get("/receipt/:room", function (req, res) {
  try {
    chatCtrl.readLastMessage(req.params.room).then(
      function (msg) {
        res.send(msg);
      },
      function (err) {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

router.get("/read/:room", function (req, res) {
  try {
    chatCtrl.readLastMessage(req.params.room).then(
      function (chat) {
        res.send({ success: true });
      },
      function (err) {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

router.get("/group/", function (req, res) {
  try {
    chatCtrl.getGroupChatsByCreatedBy(req.query.id, ["room", "created_date", "name", "users"]).then(
      function (chats) {
        res.send(chats);
      },
      function (err) {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

router.get("/:room", function (req, res) {
  try {
    chatCtrl.getChatByRoom(req.params.room).then(
      function (chat) {
        var clonedChat = chat.getJSON();
        chatCtrl._getChatMeta(chat).then(
          function (meta) {
            var users = meta.users;
            clonedChat.users = clonedChat.users.map(function (user) {
              for (var n = 0; n < users.length; n++) {
                if (users[n]._id == user.user_id) {
                  user.fname = users[n].fname;
                  user.lname = users[n].lname;
                  user.profile_pic = users[n].profile_pic;
                  return user;
                }
              }
            });
            res.send(clonedChat);
          },
          function (err) {
            res.status(err.status).send(err.message);
          },
        );
      },
      function (err) {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

router.post("/group/", function (req, res) {
  try {
    var groupChatId = Date.now().toString();
    chatCtrl.createChat(req.body.id, groupChatId, req.body.users, true, req.body.name).then(
      function (result) {
        var clonedChat = result.chat.getJSON();
        var users = result.users;

        clonedChat.users = clonedChat.users.map(function (user) {
          for (var n = 0; n < users.length; n++) {
            if (users[n]._id == user.user_id) {
              user.fname = users[n].fname;
              user.lname = users[n].lname;
              user.profile_pic = users[n].profile_pic;
              return user;
            }
          }
        });
        res.send(clonedChat);
      },
      function () {
        res.status(err.status).send(err.message);
      },
    );
  } catch (e) {
    // console.log('create group chat error :', e);
    res.status(500).send("Internal server error");
  }
});

// route for uploading images asynchronously
router.post("/group/upload-image-message", function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    var data = {
      albumName: fields.albumName,
      file: files.file,
      chatRoom: fields.chatRoom,
      message_type: fields.message_type,
      message: fields.message,
      from: fields.from,
    };

    try {
      chatCtrl.addNewGroupChatImageMessage(data).then(
        function (response) {
          res.send(response);
        },
        function (err) {
          res.send(err);
        },
      );
    } catch (e) {
      console.log("upload image message error: ", e);
      res.status(500).send("Internal server error");
    }
  });
});

module.exports = router;
