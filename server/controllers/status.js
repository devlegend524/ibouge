var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var notification = require('../controllers/notification');
var statusUpdate = mongoose.model('statusUpdate');
var userModel = mongoose.model('User');

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
  getStatusUpdates: function (users) {
    return new Promise((resolve, reject) => {
      // var
      statusUpdate.find({}, function (err, statuses) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }
        return resolve(statuses);
      });
    });
  },

  deleteStatus: function (id, from) {
    return new Promise((resolve, reject) => {
      // update statusUpdate Schema for user
      statusUpdate.findOneAndUpdate(
        {'status._id': id},
        {
          $pull: {
            status: {
              _id: id,
            },
          },
        },
        function (err, status) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }
          return resolve({success: true});
        }
      );
    });
  },

  deleteReply: function (reply_id, status_id) {
    return new Promise((resolve, reject) => {
      // update statusUpdate Schema for user
      statusUpdate.updateOne(
        {'status._id': status_id},
        {
          $pull: {
            'status.$.replies': {
              _id: reply_id,
            },
          },
        },
        function (err, status) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }
          return resolve({success: true});
        }
      );
    });
  },

  createNewStatus: function (
    from,
    statusType,
    message,
    time,
    size,
    filename,
    caption,
    likes
  ) {
    return new Promise((resolve, reject) => {
      if (!from || !statusType || !time || !likes) {
        return reject({status: 401, message: 'not sufficient information'});
      }

      statusUpdate.findOne({user: from}, function (err, status) {
        if (err) {
          return err;
        }

        // if no status exists under this user, then make a new Schema
        if (!status) {
          var sData = {
            user: from,
            status: [
              {
                status_type: statusType,
                message: filename ? filename : message,
                time: time,
                from: from,
                size: size,
                filename: filename,
                likes: likes,
                caption: caption,
              },
            ],
          };
          var newStatus = new statusUpdate(sData);

          newStatus.save(function (err) {
            if (err) {
              return reject({status: 500, message: err});
            }

            return resolve(newStatus);
          });
        }

        // update statusUpdate Schema for user
        statusUpdate.findOneAndUpdate(
          {user: from},
          {
            $push: {
              status: {
                $each: [
                  {
                    status_type: statusType,
                    message: filename ? filename : message,
                    time: time,
                    from: from,
                    size: size,
                    filename: filename,
                    likes: likes,
                    caption: caption,
                  },
                ],
                $position: 0,
              },
            },
          },
          {new: true, select: {status: {$slice: 1}}},
          function (err, status) {
            if (err) {
              return reject({status: 500, message: err});
            }
            return resolve(status);
          }
        );
      });
    });
  },

  createNewReply: function (status, from, replyType, message, time, cb) {
    if (!status || !from || !replyType || !message || !time) {
      console.log('not sufficient information');
      return;
    }

    // update statusUpdate Schema for user
    statusUpdate.findOneAndUpdate(
      {'status._id': status},
      {
        $push: {
          'status.$.replies': {
            $each: [
              {
                reply_type: replyType,
                message: message,
                time: time,
                from: from,
              },
            ],
            $position: 0,
          },
        },
      },
      {new: true, select: {status: {$slice: 1}}},
      function (err, reply) {
        if (err) {
          console.log('Internal server error');
          return;
        }
        userModel.findOne({_id: from}, function (err, userData) {
          if (err) {
            console.log('Error while adding a reply: ', err);
            return;
          }
          if (!userData) {
            console.log('Error while adding a reply: User does not exist.');
            return;
          }

          var data = {
            from: from,
            to: reply.user,
            name: userData['fname'] + ' ' + userData['lname'],
            post: status,
            reply: reply.status[0].replies[0],
          };

          if (from != reply.user) {
            notification.addNotification('reply-request', data, cb);
          } else {
            cb(null, [], data);
          }
        });
      }
    );
  },

  uploadDataToBucketAndCreateStatus: function (data) {
    return new Promise((resolve, reject) => {
      // if data does not exist, it will send an error message
      if (!data) {
        return reject({status: 401, message: 'event name not found'});
      }

      // if a file was received, this will save the picture first then create and save the new status
      if (data.file) {
        // this will hold the string given back by the s3bucket.load function
        var linkToPhoto = '';

        // name of the album + a forward slash
        var albumPhotosKey = encodeURIComponent(data.albumName) + '/';

        // current time
        var currentTime = new Date().getTime().toString();

        // generate random password based on current time
        var generatedString = randomize('A0', 20);

        // photo object key
        var photoKey = albumPhotosKey + data.userId + '_' + generatedString;

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

              // we create the new status here
              statusUpdate.findOne({user: data.userId}, function (err, status) {
                if (err) {
                  return reject({
                    status: 500,
                    message: 'Internal server error',
                  });
                }

                // if no status exists under this user, then make a new Schema
                if (!status) {
                  var newStatus = new statusUpdate({
                    user: data.userId,
                    status: [
                      {
                        status_type: data.status_type,
                        message: linkToPhoto,
                        caption: data.message,
                        time: data.time,
                        from: data.userId,
                        likes: [],
                      },
                    ],
                  });

                  newStatus.save(function (err) {
                    if (err) {
                      return reject({
                        status: 500,
                        message: 'Internal server error',
                      });
                    }
                    return resolve(newStatus);
                  });
                } else {
                  // update statusUpdate Schema for user
                  statusUpdate.findOneAndUpdate(
                    {user: data.userId},
                    {
                      $push: {
                        status: {
                          $each: [
                            {
                              status_type: data.status_type,
                              message: linkToPhoto,
                              caption: data.message,
                              time: data.time,
                              from: data.userId,
                              likes: [],
                            },
                          ],
                          $position: 0,
                        },
                      },
                    },
                    {
                      new: true,
                      select: {status: {$slice: 1}},
                    },
                    function (err, status) {
                      if (err) {
                        return reject({
                          status: 500,
                          message: 'Internal server error',
                        });
                      }
                      return resolve(status);
                    }
                  );
                }
              });
            }
          });
        });
      }
    });
  },

  addLikeToStatusOrReply: function (id, like, cb) {
    var find = {};
    var update = {};
    if (like.reply) {
      find = {
        status: {$elemMatch: {_id: id}},
      };

      statusUpdate.findOne(
        find,
        {'status.$.replies': 1},
        function (err, statusData) {
          if (err) {
            console.log('err adding like: ', err);
            return;
          }
          if (!statusData) {
            console.log('Post does not exist');
            return;
          }
          var index = -1;
          for (var i = 0; i < statusData.status[0].replies.length; i++) {
            if (statusData.status[0].replies[i]['_id'] == like.reply._id) {
              index = i;
              break;
            }
          }

          if (index != -1) {
            update = {
              $push: {},
            };
            var str = 'status.$.replies.' + index + '.likes';
            update['$push'][str] = {
              $each: [{from: like.from, date: like.when}],
              $position: 0,
            };

            statusUpdate.findOneAndUpdate(
              find,
              update,
              function (err, statusData) {
                if (err) {
                  console.log('err adding like: ', err);
                  return;
                }
                if (!statusData) {
                  console.log('Post does not exist');
                  return;
                }
                userModel.findOne({_id: like.from}, function (err, userData) {
                  if (err) {
                    console.log('Error while adding a like: ', err);
                    return;
                  }
                  if (!userData) {
                    console.log(
                      'Error while adding a like: User does not exist.'
                    );
                    return;
                  }
                  var data = {
                    from: like.from,
                    to: statusData['user'],
                    name: userData['fname'] + ' ' + userData['lname'],
                    post: id,
                    reply: like.reply._id,
                  };
                  if (like.from != statusData['user']) {
                    notification.addNotification('like-request', data, cb);
                  }
                });
              }
            );
          }
        }
      );
    } else {
      find = {
        status: {$elemMatch: {_id: id}},
      };
      update = {
        $push: {
          'status.$.likes': {
            $each: [{from: like.from, date: like.when}],
            $position: 0,
          },
        },
      };

      statusUpdate.findOneAndUpdate(find, update, function (err, statusData) {
        if (err) {
          console.log('err adding like: ', err);
          return;
        }
        if (!statusData) {
          console.log('Post does not exist');
          return;
        }
        userModel.findOne({_id: like.from}, function (err, userData) {
          if (err) {
            console.log('Error while adding a like: ', err);
            return;
          }
          if (!userData) {
            console.log('Error while adding a like: User does not exist.');
            return;
          }
          var data = {
            from: like.from,
            to: statusData['user'],
            name: userData['fname'] + ' ' + userData['lname'],
            post: id,
          };
          if (like.from != statusData['user']) {
            notification.addNotification('like-request', data, cb);
          }
        });
      });
    }
  },

  removeLikeFromStatus: function (id, user) {
    statusUpdate.updateOne(
      {
        // _id: like.createdBy,
        status: {$elemMatch: {_id: id}},
      },
      {
        $pull: {'status.$.likes': {from: user}},
      },
      function (err) {
        if (err) {
          console.log('err adding like: ', err);
        }
      }
    );
  },

  removeLikeFromReply: function (id, reply, user) {
    var find = {
      status: {$elemMatch: {_id: id}},
    };
    statusUpdate.findOne(
      find,
      {'status.$.replies': 1},
      function (err, statusData) {
        if (err) {
          console.log('err adding like: ', err);
          return;
        }
        if (!statusData) {
          console.log('Post does not exist');
          return;
        }
        var index = -1;
        for (var i = 0; i < statusData.status[0].replies.length; i++) {
          if (statusData.status[0].replies[i]['_id'] == reply._id) {
            index = i;
            break;
          }
        }

        if (index != -1) {
          var update = {
            $pull: {},
          };
          var str = 'status.$.replies.' + index + '.likes';
          update['$pull'][str] = {
            from: user,
          };

          statusUpdate.findOneAndUpdate(
            find,
            update,
            function (err, statusData) {
              if (err) {
                console.log('err adding like: ', err);
              }
            }
          );
        }
      }
    );
  },
};
