var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var User = mongoose.model('User');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load fs to read incoming file
var fs = require('fs');
// Load randomatic library
var randomize = require('randomatic');
var path = require('path');
var dirPath = path.join(__dirname, '../../config/config.json');

// credentials for AWS SDK
AWS.config.loadFromPath(dirPath);

// global variable for bucket
var s3bucket = new AWS.S3({});

module.exports = {
  getHistory: function (room, limit, offset) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Room not found'});
      }

      limit = limit ? Number(limit) : 20;
      offset = offset ? Number(offset) : 0;

      Chat.findOne(
        {room: room},
        {messages: {$slice: [offset, limit]}},
        function (err, chat) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          if (!chat) {
            return reject({status: 404, message: 'Chat not found'});
          }

          return resolve(chat);
        }
      );
    });
  },

  updateLastMessage: function (room) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Chat not found'});
      }

      Chat.findOneAndUpdate(
        {room: room},
        {$set: {'messages.0.read_at': Date.now()}},
        function (err, chat) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          if (!chat) {
            return reject({status: 404, message: 'Chat not found'});
          }

          return resolve(chat);
        }
      );
    });
  },

  readLastMessage: function (room) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Chat not found'});
      }

      Chat.findOne({room: room}, function (err, chat) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!chat) {
          return reject({status: 404, message: 'Chat not found'});
        }

        return resolve(chat.messages[0]);
      });
    });
  },

  _getChatMeta: function (chat) {
    return new Promise((resolve, reject) => {
      var userIds = chat.users.map(function (user) {
        return user.user_id;
      });
      var meta = {};

      User.find(
        {_id: {$in: userIds}},
        ['fname', 'lname', 'profile_pic'],
        function (err, chatUsers) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          meta.users = chatUsers;
          return resolve(meta);
        }
      );
    });
  },

  createChat: function (myId, room, users, isGroupChat, groupChatName) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Room not found'});
      }

      Chat.findOne({room: room}, function (err, chat) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }
        if (chat) {
          return reject({status: 401, message: 'Chat already exists'});
        }

        User.find(
          {_id: {$in: users}},
          ['fname', 'lname', 'profile_pic'],
          function (err, _chatUsers) {
            if (err) {
              return reject({status: 500, message: 'Internal server error'});
            }

            if (!_chatUsers || _chatUsers.length == 0) {
              return reject({status: 404, message: 'No users found for chat'});
            }

            var chatUsers = _chatUsers.map(function (user) {
              return myId == user._id
                ? {user_id: user._id, last_login: Date.now()}
                : {user_id: user._id};
            });

            var newChat = new Chat();
            (newChat.created_by = myId),
              (newChat.name = groupChatName ? groupChatName : '');
            newChat.room = room;
            newChat.users = chatUsers;
            newChat.messages = [];
            newChat.created_date = Date.now();
            newChat.is_group_chat = isGroupChat;
            newChat.save(function (err) {
              if (err) {
                return reject({status: 500, message: 'Internal server error'});
              }

              return resolve({chat: newChat, users: _chatUsers});
            });
          }
        );
      });
    });
  },

  myInbox: function (id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject({status: 401, message: 'Invalid user'});
      }

      Chat.find(
        {
          'users.user_id': id,
          messages: {$exists: true, $ne: []},
        },
        {messages: {$slice: [0, 1]}},
        {sort: {last_updated_date: -1}},
        function (err, chats) {
          if (err) {
            return reject({status: 400, message: 'Bad request'});
          }
          return resolve(chats);
        }
      );
    });
  },

  addNewChatMessage: function (room, msg) {
    Chat.updateOne(
      {room: room},
      {
        $set: {
          last_updated_date: Date.now(),
        },

        $push: {
          messages: {
            $each: [msg],
            $position: 0,
          },
        },
      },
      function (err) {
        if (err) {
          // console.log('chat msg error :', err);
        }
      }
    );
  },

  addNewGroupChatImageMessage: function (data) {
    return new Promise((resolve, reject) => {
      // if data does not exist, throw an error message
      if (!data) {
        return reject({status: 401, message: 'not enough data'});
      }

      // if file was received, then save the image to bucket then create and save new message to DB
      if (data.file) {
        // this will hold the string given back by the s3bucket.load function
        var linkToPhoto = '';

        // name of the album + a forward slash
        var albumPhotosKey = encodeURIComponent(data.albumName) + '/';

        // this will hold the random generated string
        var generatedString = '';

        // while the generatedString is empty
        while (generatedString === '') {
          // get current time
          var currentTime = new Date().getTime();

          // turn currentTime into a string
          var toStringDate = currentTime.toString();

          // pass date string to randomize to get 15 char random string
          generatedString = randomize(toStringDate, 15);
        }

        // once generatedString is no longer empty
        if (generatedString !== '') {
          // produce photo object key
          var photoKey = albumPhotosKey + data.from + '_' + generatedString;

          // read the file then upload to S3 bucket
          fs.readFile(data.file.path, function (err, fileData) {
            if (err) {
              throw err;
            }

            var params = {
              Bucket: 'ibouge',
              Key: photoKey,
              Body: fileData,
              ACL: 'public-read',
            };

            // upload photo to s3 bucket
            s3bucket.upload(params, function (err, photo) {
              // if error occurs
              if (err) {
                console.log(
                  'error happened while saving file to S3 Bucket: ',
                  err
                );
                return reject({status: 500, message: 'Internal server error'});
              }
              // if photo saves successfully
              else {
                // photo.Location is set to linkToPhoto
                linkToPhoto = photo.Location;

                // then find and update chat
                Chat.findOneAndUpdate(
                  {room: data.chatRoom},
                  {
                    $set: {
                      last_updated_date: Date.now(),
                    },
                    $push: {
                      messages: {
                        $each: [
                          {
                            from: data.from,
                            message_type: data.message_type,
                            message: linkToPhoto,
                            time: Date.now(),
                          },
                        ],
                        $position: 0,
                      },
                    },
                  },
                  {
                    new: true,
                    select: {messages: {$slice: 1}},
                  },
                  function (err, message) {
                    if (err) {
                      return reject({
                        status: 500,
                        message: 'Internal server error',
                      });
                    }
                    return resolve(message);
                  }
                );
              }
            });
          });
        }
      }
    });
  },

  setLastLogout: function (userId, room) {
    Chat.updateOne(
      {room: room, 'users.user_id': userId},
      {
        $set: {'users.$.last_logout': Date.now()},
      },
      function (err) {
        if (err) {
          // console.log('last logout error :', err);
        }
      }
    );
  },

  setLastLogin: function (userId, room) {
    return new Promise((resolve, reject) => {
      Chat.updateOne(
        {room: room, 'users.user_id': userId},
        {
          $set: {'users.$.last_login': Date.now()},
        },
        function (err) {
          if (err) {
            // console.log('last login error :', err);
            return reject({status: 500, message: 'Internal server error'});
          }
          return resolve('success');
        }
      );
    });
  },

  getChatByRoom: function (room) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Invalid room'});
      }

      Chat.findOne({room: room}, function (err, chat) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!chat) {
          return reject({status: 404, message: 'Chat not found'});
        }

        return resolve(chat);
      }).select('-messages');
    });
  },

  getGroupChatsByCreatedBy: function (userId, fields) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject({status: 401, message: 'Invalid id'});
      }

      fields = fields ? fields : null;

      Chat.find(
        {created_by: userId, is_group_chat: true},
        fields,
        function (err, chats) {
          if (err || !chats) {
            return reject({status: 500, message: 'Internal server error'});
          }

          return resolve(chats);
        }
      );
    });
  },
};
