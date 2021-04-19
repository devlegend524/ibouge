var mongoose = require('mongoose');
var Microblog = mongoose.model('Microblog');
var User = mongoose.model('User');
var fileHandler = require('../services/fileHandler');

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
  getMicroblogHistory: function (room, limit, offset) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Room not found'});
      }
      limit = limit ? Number(limit) : 20;
      offset = offset ? Number(offset) : 0;

      Microblog.findOne(
        {room: room},
        {messages: {$slice: [offset, limit]}},
        function (err, microblog) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          if (!microblog) {
            return reject({status: 404, message: 'Microblog not found'});
          }

          return resolve(microblog);
        }
      );
    });
  },

  _getMicroblogMeta: function (microblog) {
    return new Promise((resolve, reject) => {
      var userIds = microblog.users.map(function (user) {
        return user.user_id;
      });
      var meta = {};

      User.find(
        {_id: {$in: userIds}},
        ['fname', 'lname', 'profile_pic'],
        function (err, microblogUsers) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          meta.users = microblogUsers;
          return resolve(meta);
        }
      );
    });
  },

  getMicroblogs: function () {
    return new Promise((resolve, reject) => {
      Microblog.find({}, function (err, microblogs) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }
        return resolve(microblogs);
      });
    });
  },

  // this function saves microblog image to the bucket first, then creates and saves the microblog
  createMicroblog: function (data) {
    return new Promise((resolve, reject) => {
      // if data does not exist, it will send rejection message
      if (!data) {
        return reject({status: 401, message: 'Room not found'});
      }

      // if a file was received, this will save the picture to the bucket first, then create and save microblog
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

          // turn current time into a string
          var toStringDate = currentTime.toString();

          // pass date string to randomize to get 15 character random string
          generatedString = randomize(toStringDate, 15);
        }

        // if generatedString is no longer empty
        if (generatedString !== '') {
          // produce photo object key
          var photoKey =
            albumPhotosKey +
            data.userId +
            '_' +
            data.room +
            '_' +
            generatedString;

          // read the file to then upload to bucket
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
            // upload photo to bucket
            s3bucket.upload(params, function (err, photo) {
              // if error occurs
              if (err) {
                console.log(
                  'error happened while saving file to s3 bucket: ',
                  err
                );
                return reject({status: 500, message: 'Internal server error'});
              }
              // else, if photo saves successfully
              else {
                // assign the Location of photo to linkToPhoto
                linkToPhoto = photo.Location;

                // we create and save the new microblog here
                Microblog.findOne({room: data.room}, function (err, microblog) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: 'Internal server error',
                    });
                  }

                  if (microblog) {
                    return reject({
                      status: 401,
                      message: 'Microblog already exists',
                    });
                  }

                  User.find(
                    {_id: {$in: data.users}},
                    ['fname', 'lname', 'profile_pic'],
                    function (err, _microblogUsers) {
                      if (err) {
                        return reject({
                          status: 404,
                          message: 'Internal server error',
                        });
                      }

                      if (!_microblogUsers || _microblogUsers.length === 0) {
                        return reject({
                          status: 404,
                          message: 'No users found for microblog',
                        });
                      }

                      var microblogUsers = _microblogUsers.map(function (user) {
                        return data.userId === user._id
                          ? {user_id: user._id, last_login: Date.now()}
                          : {user_id: user._id};
                      });

                      var newMicroblog = new Microblog();
                      newMicroblog.created_by = data.userId;
                      newMicroblog.coordinates = data.coordinates;
                      newMicroblog.name = data.name ? data.name : '';
                      newMicroblog.room = data.room;
                      newMicroblog.users = microblogUsers;
                      newMicroblog.microblog_img = linkToPhoto;
                      newMicroblog.messages = [];
                      newMicroblog.created_date = Date.now();
                      newMicroblog.allInvolved = [{user_id: data.userId}];
                      if (data.isMicroblog === 'true') {
                        newMicroblog.is_microblog = true;
                      }

                      // save new microblog
                      newMicroblog.save(function (err) {
                        if (err) {
                          return reject({
                            status: 500,
                            message: 'Internal server error',
                          });
                        }

                        // once new microblog is created and saved, add microblog room to user's bookmarked_microblogs array
                        User.findOne({_id: data.userId}, function (err, user) {
                          if (err) {
                            return reject({
                              status: 500,
                              message: 'Internal server error',
                            });
                          }

                          if (!user) {
                            return reject({
                              status: 404,
                              message: 'User not found',
                            });
                          }

                          var microblogs = user.bookmarked_microblogs
                            ? user.bookmarked_microblogs
                            : [];

                          for (var i = 0; i < microblogs.length; i++) {
                            if (data.room === microblogs[i]) {
                              return reject({
                                status: 401,
                                message: 'microblog has already been added',
                              });
                            }
                          }

                          if (microblogs.indexOf(data.room) < 0) {
                            microblogs.push(data.room);
                          }

                          user.bookmarked_microblogs = microblogs;
                          user.save(function (err) {
                            if (err) {
                              return reject({
                                status: 500,
                                message: 'Internal server error',
                              });
                            }
                            // return resolve(user);
                          });
                        });

                        // return new microblog and microblog users to client
                        return resolve({
                          microblog: newMicroblog,
                          users: _microblogUsers,
                        });
                      });
                    }
                  );
                });
              }
            });
          });
        }
      } else {
        // if no picture was assigned to new microblog, we create and save the new microblog here with a generic image
        Microblog.findOne({room: data.room}, function (err, microblog) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          if (microblog) {
            return reject({status: 401, message: 'Microblog already exists'});
          }

          User.find(
            {_id: {$in: data.users}},
            ['fname', 'lname', 'profile_pic'],
            function (err, _microblogUsers) {
              if (err) {
                return reject({status: 404, message: 'Internal server error'});
              }

              if (!_microblogUsers || _microblogUsers.length === 0) {
                return reject({
                  status: 404,
                  message: 'No users found for microblog',
                });
              }

              var microblogUsers = _microblogUsers.map(function (user) {
                return data.userId === user._id
                  ? {user_id: user._id, last_login: Date.now()}
                  : {user_id: user._id};
              });

              var newMicroblog = new Microblog();
              newMicroblog.created_by = data.userId;
              newMicroblog.coordinates = data.coordinates;
              newMicroblog.name = data.name ? data.name : '';
              newMicroblog.room = data.room;
              newMicroblog.users = microblogUsers;
              newMicroblog.microblog_img = 'img/noImageAvailable.jpg';
              newMicroblog.messages = [];
              newMicroblog.created_date = Date.now();
              if (data.isMicroblog === 'true') {
                newMicroblog.is_microblog = true;
              }

              // save new microblog
              newMicroblog.save(function (err) {
                if (err) {
                  return reject({
                    status: 500,
                    message: 'Internal server error',
                  });
                }

                // once new microblog is created and saved, add microblog room to user's bookmarked_microblogs array
                User.findOne({_id: data.userId}, function (err, user) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: 'Internal server error',
                    });
                  }

                  if (!user) {
                    return reject({status: 404, message: 'User not found'});
                  }

                  var microblogs = user.bookmarked_microblogs
                    ? user.bookmarked_microblogs
                    : [];

                  for (var i = 0; i < microblogs.length; i++) {
                    if (data.room === microblogs[i]) {
                      return reject({
                        status: 401,
                        message: 'microblog has already been added',
                      });
                    }
                  }

                  if (microblogs.indexOf(data.room) < 0) {
                    microblogs.push(data.room);
                  }

                  user.bookmarked_microblogs = microblogs;
                  user.save(function (err) {
                    if (err) {
                      console.log(
                        "error happened while saving new microblog room to user's bookmarked_microblogs: ",
                        err
                      );

                      return reject({
                        status: 500,
                        message: 'Internal server error',
                      });
                    }
                  });
                });

                // return new microblog and microblog users to client
                return resolve({
                  microblog: newMicroblog,
                  users: _microblogUsers,
                });
              });
            }
          );
        });
      }
    });
  },

  // myInbox: function(id) {
  //     return new Promise((resolve, reject) => {
  //         if (!id) {
  //         return reject({status: 401, message: 'Invalid user'});
  //     }
  //
  //     Chat.find({'users.user_id': id, 'messages': {$exists: true, $ne: []}}, {messages: {$slice: [0, 1]}},
  //         {sort: {'last_updated_date': -1}},
  //         function(err, chats) {
  //             if (err) {
  //                 return reject({status: 400, message: 'Bad request'});
  //             }
  //
  //             return resolve(chats);
  //         });
  // });
  // },

  updateMicroblogPic: function (room, data) {
    return new Promise((resolve, reject) => {
      Microblog.findOne({room: room}, function (err, microblog) {
        if (err) {
          return reject(err);
        }

        var name = new Date().getTime() + '.' + data.type;
        var img = new Buffer(data.image, 'base64');

        fileHandler.createFile(name, img, 'upload').then(
          function () {
            microblog.microblog_img = name;

            // update microblog
            microblog.save(function (err) {
              if (err) {
                return reject(err);
              }
              return resolve(microblog);
            });
          },
          function (err) {
            return reject(err);
          }
        );
      });
    });
  },

  saveImageMessage: function (data) {
    return new Promise((resolve, reject) => {
      // if data does not exist, it will send an error message
      if (!data) {
        return reject({status: 401, message: 'no data'});
      }

      // if file was sent, this will save the image to bucket, then save new message in DB
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

          // turn current time into a string
          var toStringDate = currentTime.toString();

          // pass date string to randomize to get 15 character random string
          generatedString = randomize(toStringDate, 15);
        }

        // once generateString isn't empty anymore
        if (generatedString !== '') {
          // produce photo object key
          var photoKey = albumPhotosKey + data.from + '_' + generatedString;

          // read the file to then upload to s3bucket
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

            // upload photo to s3bucket
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

                // then find and update microblog
                Microblog.findOneAndUpdate(
                  {room: data.microblogRoom},
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

  addNewMicroblogMessage: function (room, msg) {
    Microblog.updateOne(
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
          console.log('microblog msg error:', err);
        }
      }
    );
  },

  addMicroblogUser: function (room, user) {
    return new Promise((resolve, reject) => {
      Microblog.findOne({room: room}, function (err, microblog) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!microblog) {
          return reject({status: 404, message: 'Microblog not found'});
        }

        var users = microblog.users;

        for (var i = 0; i < users.length; i++) {
          if (user === users[i].user_id) {
            return reject({
              status: 401,
              message: 'user has already been added',
            });
          }
        }

        if (!room) {
          return reject({status: 401, message: 'Room not found'});
        }

        var microblogUser = {user_id: user, last_login: Date.now()};

        Microblog.updateOne(
          {room: room},
          {
            $push: {
              users: microblogUser,
            },
          },
          function (err) {
            if (err) {
              // console.log('add user to microblog error:', err);
            }
          }
        );
      });
    });
  },

  //This function adds the user to this array in the database
  addMeToAllInvolved: function (data) {
    return new Promise((resolve, reject) => {
      Microblog.findOne({room: data.room}, function (err, microblog) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!microblog) {
          return reject({status: 404, message: 'Microblog not found'});
        }

        if (!data.room) {
          return reject({status: 401, message: 'Room not found'});
        }

        var allInvolved = microblog.allInvolved;

        for (var i = 0; i < allInvolved.length; i++) {
          if (data.user === allInvolved[i].user_id) {
            return reject({
              status: 401,
              message: 'user has already been added',
            });
          }
        }

        var tempUser = {user_id: data.user};

        Microblog.updateOne(
          {room: data.room},
          {
            $push: {
              allInvolved: tempUser,
            },
          },
          function (err) {
            if (err) {
              // console.log('add user to microblog error:', err);
            }
          }
        );
      });
    });
  },

  updateAllInvolvedArray: function (data) {
    return new Promise((resolve, reject) => {
      Microblog.findOne({room: data.room}, function (err, microblog) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!microblog) {
          return reject({status: 404, message: 'Microblog not found'});
        }

        if (!data.room) {
          return reject({status: 401, message: 'Room not found'});
        }

        var allInvolvedArray = microblog.allInvolved;

        if (data.users.length > 1) {
          for (var i = 0; i < data.users.length; i++) {
            var j = 0;
            var len = allInvolvedArray.length;
            for (; j < len; ) {
              if (data.users[i] !== allInvolvedArray[j].user_id) {
                // console.log("its not a match...");
                j++;
                if ((j = allInvolvedArray.length)) {
                  var tempUser = {user_id: data.users[i]};
                  Microblog.updateOne(
                    {room: data.room},
                    {
                      $push: {
                        allInvolved: tempUser,
                      },
                    },
                    function (err) {
                      if (err) {
                        // console.log('update friendsInvited error: ', err);
                      }
                    }
                  );
                }
              } else {
                return reject({
                  status: 401,
                  message: 'user has already been added',
                });
              }
            }
          }
        } else {
          var allInvolved = microblog.allInvolved;

          for (var i = 0; i < allInvolved.length; i++) {
            if (data.users === allInvolved[i].user_id) {
              return reject({
                status: 401,
                message: 'user has already been added',
              });
            }
          }

          var tempUser = {user_id: data.users};

          Microblog.updateOne(
            {room: data.room},
            {
              $push: {
                allInvolved: tempUser,
              },
            },
            function (err) {
              if (err) {
                // console.log('add user to microblog error:', err);
              }
            }
          );
        }
      });
    });
  },

  // The user is removed as a user when they un-bookmark a microblog
  removeMicroblogUser: function (userId, room) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Room not found'});
      }
      Microblog.updateOne(
        {room: room},
        {
          $pull: {
            users: {
              user_id: userId,
            },
          },
        },
        function (err) {
          if (err) {
            // console.log('Update user failed :', err);
          }
        }
      );
    });
  },

  setLastLogoutMicroblog: function (userId, room) {
    Microblog.updateOne(
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

  setLastLoginMicroblog: function (userId, room) {
    return new Promise((resolve, reject) => {
      Microblog.updateOne(
        {room: room, 'users.user_id': userId},
        {
          $set: {'users.$.last_login': Date.now()},
        },
        function (err) {
          if (err) {
            // console.log('last login error:', err);
            return reject({status: 500, message: 'Internal server error'});
          }
          return resolve('success');
        }
      );
    });
  },

  getMicroblogByRoom: function (room) {
    return new Promise((resolve, reject) => {
      if (!room) {
        return reject({status: 401, message: 'Invalid room'});
      }

      Microblog.findOne({room: room}, function (err, microblog) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!microblog) {
          return reject({status: 404, message: 'Microblog not found'});
        }

        return resolve(microblog);
      });
    });
  },

  getMicroblogsByCreatedBy: function (userId, fields) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject({status: 401, message: 'Invalid id'});
      }

      fields = fields ? fields : null;

      Microblog.find(
        {created_by: userId, is_microblog: true},
        fields,
        function (err, microblogs) {
          if (err || !chats) {
            return reject({status: 500, messages: 'Internal server error'});
          }

          return resolve(microblogs);
        }
      );
    });
  },
};
