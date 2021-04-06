var mongoose = require("mongoose");
var User = mongoose.model("User");
var Friend = mongoose.model("Friend");
var Chat = mongoose.model("Chat");
var Notification = mongoose.model("Notification");
var Microblog = mongoose.model("Microblog");
var fileHandler = require("../services/fileHandler");
var mailer = require("../services/mailer.js");
var util = require("../services/util.js");

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Load fs to read incoming file
var fs = require("fs");
// Load randomatic library
var randomize = require("randomatic");
var path = require('path');
var dirPath = path.join(__dirname, '../../config/config.json');

// credentials for AWS SDK
AWS.config.loadFromPath(dirPath);

// global variable for bucket
var s3bucket = new AWS.S3({});

module.exports = {
  getUserByEmail: function (email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        return reject({
          status: 401,
          message: "Invalid data",
        });
      }

      User.findOne(
        {
          email: email,
        },
        function (err, user) {
          if (err || !user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          return resolve(user);
        },
      );
    });
  },
  getUserById: function (id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject({
          status: 401,
          message: "Invalid data",
        });
      }

      User.findOne(
        {
          _id: id,
        },
        function (err, user) {
          if (err || !user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          return resolve(user);
        },
      );
    });
  },

  getMeta: function (myId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, user) {
          if (err || !user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }
          var meta = {};

          Chat.findOne(
            {
              "users.user_id": myId,
            },
            ["last_updated_date", "messages", "users", "is_group_chat"],
            {
              sort: {
                last_updated_date: -1,
              },
            },
            function (err, chat) {
              Notification.findOne(
                {
                  recipients: {
                    $in: [myId],
                  },
                },
                ["date"],
                {
                  sort: {
                    date: -1,
                  },
                },
                function (err, notification) {
                  var number = 0;

                  if (chat && !notification) {
                    number = 1;
                  } else if (notification && !chat) {
                    number = 2;
                  } else if (chat && notification) {
                    number = 3;
                  }
                  switch (number) {
                    case 1:
                      meta.new_inbox = false;

                      for (message in chat.messages) {
                        if (message.read_at === null) {
                          meta.new_inbox = true;
                          break;
                        }
                      }

                      return resolve(meta);
                    case 2:
                      notification.date > user.notifications_last_viewed_time
                        ? (meta.new_notification = true)
                        : (meta.new_notification = false);

                      return resolve(meta);

                    case 3:
                      meta.new_inbox = false;
                      for (message in chat.messages) {
                        if (message.read_at === null) {
                          meta.new_inbox = true;
                          break;
                        }
                      }

                      notification.date > user.notifications_last_viewed_time
                        ? (meta.new_notification = true)
                        : (meta.new_notification = false);

                      return resolve(meta);

                    default:
                      return reject({
                        status: 500,
                        message: "Internal server error",
                      });
                  }
                },
              );
            },
          );
        },
      );
    });
  },

  // this information is fetched when new user is added to a microblog
  getUserMeta: function (id) {
    return new Promise((resolve, reject) => {
      var meta = {};

      User.find(
        {
          _id: id,
        },
        ["fname", "lname", "profile_pic"],
        function (err, user) {
          if (err || !user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          meta.user = user;
          return resolve(meta);
        },
      );
    });
  },

  filter: function (filter) {
    return new Promise((resolve, reject) => {
      User.find(filter, function (err, users) {
        if (err) {
          return reject({
            status: 500,
            message: "Internal server error",
          });
        }

        return resolve(users);
      });
    });
  },
  updateUser: function (email, data) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email: email,
        },
        function (err, user) {
          if (err) {
            return reject(err);
          }

          Object.keys(data).forEach(function (key) {
            switch (key) {
              case "ip":
              case "latitude":
              case "longitude":
              case "activation_status":
              case "area_name":
              case "account_type":
              case "area_id":
                user[key] = data[key];
                break;

              case "profile":
                var profile = data[key];
                Object.keys(profile).forEach(function (profileKey) {
                  switch (profileKey) {
                    case "about_me":
                    case "interests":
                    case "languages":
                    case "website":
                    case "phone":
                      user[key][profileKey] = profile[profileKey];
                      break;
                    default:
                      break;
                  }
                });
                break;

              case "privacy":
                var privacy = data[key];
                Object.keys(privacy).forEach(function (privacyKey) {
                  switch (privacyKey) {
                    case "only_members_see_profile":
                    case "share_recent_events":
                    case "show_my_friends":
                    case "is_profile_public":
                    case "new_messages":
                    case "block_list":
                      user[key][privacyKey] = privacy[privacyKey];
                      break;
                    default:
                      break;
                  }
                });
                break;

              case "notifications":
                var notifications = data[key];
                Object.keys(notifications).forEach(function (notificationsKey) {
                  switch (notificationsKey) {
                    case "new_messages":
                    case "new_events":
                    case "friend_requests":
                    case "invitations_to_conversation":
                    case "mutual_likes":
                      user[key][notificationsKey] = notifications[notificationsKey];
                      break;
                    default:
                      break;
                  }
                });
                break;

              case "location":
                var location = data[key];
                Object.keys(location).forEach(function (locationKey) {
                  switch (locationKey) {
                    case "coordinates":
                    case "bbox":
                    case "addrs1":
                    case "addrs2":
                    case "country":
                    case "state":
                    case "city":
                    case "zip":
                    case "lastCityFollowed":
                    case "cityToFollow":
                    case "extraCityToFollow0":
                    case "extraCityToFollow1":
                    case "extraCityToFollow2":
                      user[key][locationKey] = location[locationKey];
                      break;
                    default:
                      break;
                  }
                });
                break;

              default:
                break;
            }
          });

          user.save(function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          });
        },
      );
    });
  },

  updateProfilePic: function (email, data) {
    return new Promise((resolve, reject) => {
      // if data does not exist, throw an error message and reject
      if (!email || !data) {
        return reject({
          status: 401,
          message: "data not found",
        });
      }

      // if file was received
      if (data.file) {
        // this will hold the string given back by the s3bucket.load function
        var linkToPhoto = "";

        // name of the album + a forward slash
        var albumPhotosKey = encodeURIComponent(data.albumName) + "/";

        // this will hold the random generated string
        var generatedString = "";

        // while the generatedString is empty
        while (generatedString === "") {
          // get current time
          var currentTime = new Date().getTime();

          // turn current time into a string
          var toStringDate = currentTime.toString();

          // pass date string to randomize to get 15 character random string
          generatedString = randomize(toStringDate, 15);
        }

        // if generatedString is no longer empty
        if (generatedString !== "") {
          var photoKey = albumPhotosKey + data.userId + "_" + generatedString;

          function setProfilePic(file, photoKey, isOriginal) {
            fs.readFile(file.path, function (err, fileData) {
              //                                                console.log(file, err, fileData.length);
              if (err) {
                throw err;
              }

              var params = {
                Bucket: "ibouge",
                Key: photoKey,
                Body: fileData,
                ACL: "public-read",
              };
              console.log(params);

              // upload photo to bucket
              s3bucket.upload(params, function (err, photo) {
                // if error occurs
                if (err) {
                  console.log("error happened while saving file to s3 bucket: ", err);
                  return reject({
                    status: 500,
                    message: "Internal server error",
                  });
                }
                // else, if photo saves successfully
                else {
                  // assign the Location of photo to linkToPhoto
                  linkToPhoto = photo.Location;

                  if (isOriginal) {
                    setObj = {
                      profile_pic_original: linkToPhoto,
                    };
                  } else {
                    setObj = {
                      profile_pic: linkToPhoto,
                    };
                  }

                  // find the user by email
                  User.findOneAndUpdate(
                    {
                      email: email,
                    },
                    {
                      // set profile_pic or profile_pic_original to linkToPhoto
                      $set: setObj,
                    },
                    {
                      new: true,
                    },
                    function (err, user) {
                      if (err) {
                        return reject({
                          status: 500,
                          message: "Internal server error",
                        });
                      }
                      if (!isOriginal) {
                        console.log("resolving user");
                        return resolve(user);
                      }
                    },
                  );
                }
              });
            });
          }

          if (data.file) {
            var photoKey = albumPhotosKey + data.userId + "_" + generatedString;
            setProfilePic(data.file, photoKey, false);
          }
          if (data.originalFile) {
            var photoKey = albumPhotosKey + data.userId + "_original_" + generatedString;
            setProfilePic(data.originalFile, photoKey, true);
          }
        }
      }
    });
  },

  getFriends: function (myId) {
    return new Promise((resolve, reject) => {
      Friend.find(
        {
          users: {
            $in: [myId],
          },
        },
        function (err, friends) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          var userIds = [];
          for (var i = 0; i < friends.length; i++) {
            if (friends[i].users[0] != myId) {
              userIds.push(friends[i].users[0]);
            }
            if (friends[i].users[1] != myId) {
              userIds.push(friends[i].users[1]);
            }
          }

          User.find(
            {
              _id: {
                $in: userIds,
              },
            },
            ["fname", "lname", "is_online", "profile_pic", "location", "profile"],
            function (err, users) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              return resolve(users);
            },
          );
        },
      );
    });
  },

  getProfileFriends: function (myId, profileId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        [],
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.findOne(
            {
              _id: profileId,
            },
            ["privacy.show_my_friends"],
            function (err, profileUser) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              if (!profileUser) {
                return reject({
                  status: 404,
                  message: "User not found",
                });
              }

              if (!profileUser.privacy.show_my_friends) {
                return resolve([]);
              }

              Friend.find(
                {
                  users: {
                    $in: [profileId],
                  },
                },
                function (err, friends) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  var userIds = [];
                  for (var i = 0; i < friends.length; i++) {
                    if (friends[i].users[0] != profileId) {
                      userIds.push(friends[i].users[0]);
                    }
                    if (friends[i].users[1] != profileId) {
                      userIds.push(friends[i].users[1]);
                    }
                  }

                  User.find(
                    {
                      _id: {
                        $in: userIds,
                      },
                    },
                    ["fname", "lname", "is_online", "profile_pic"],
                    function (err, users) {
                      if (err) {
                        return reject({
                          status: 500,
                          message: "Internal server error",
                        });
                      }

                      return resolve(users);
                    },
                  );
                },
              );
            },
          );
        },
      );
    });
  },

  getAllUsers: function (id, limit, offset) {
    return new Promise((resolve, reject) => {
      limit = limit && !isNaN(Number(limit)) ? Number(limit) : 500;
      offset = offset && !isNaN(Number(offset)) ? Number(offset) : 0;
      User.find(
        {
          is_activated: true,
          "privacy.is_profile_public": true,
        },
        ["dob", "location", "fname", "lname", "profile_pic", "gender", "profile.interests", "is_online"],
        {
          skip: offset,
          limit: limit,
        },
        function (err, friends) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }
          return resolve(friends);
        },
      );
    });
  },

  getBlockList: function (email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email: email,
        },
        "privacy.block_list",
        function (err, blockList) {
          if (err) {
            return reject(err);
          }

          if (!blockList || blockList.length == 0) {
            return resolve([]);
          }

          User.find(
            {
              email: {
                $in: blockList,
              },
            },
            function (err, users) {
              if (err) {
                return reject(err);
              }
              return resolve(users);
            },
          );
        },
      );
    });
  },

  resendEmail: function (email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email: email,
        },
        function (err, user) {
          if (err) {
            return reject(err);
          }

          var activationToken = new Buffer(email + "," + new Date().getTime()).toString("base64");
          user.activation_token = activationToken;

          mailer
            .sendMail(
              "support@ibouge.com",
              email,
              mailer.introSubject,
              mailer.introBody(user, "https://localhost:3000/login?token=" + activationToken),
            )
            .then(
              function () {
                console.log("mail to", email, "sent");
              },
              function (error) {
                console.log("mail sending to", email, "failed: ", error);
              },
            );

          user.save(function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          });
        },
      );
    });
  },

  activate: function (token) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          activation_token: token,
        },
        function (err, user) {
          if (err) {
            return reject(err);
          }

          // activate user
          user.is_activated = true;

          user.save(function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          });
        },
      );
    });
  },

  restorePassword: function (email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email: email,
        },
        function (err, user) {
          if (err || !user) {
            return reject("User not found");
          }

          // create token
          var token = new Date().getTime().toString();
          var hashToken = util.createHash(token);
          user.password_restore_token = hashToken;

          // send email link
          mailer
            .sendSupportMail(
              email,
              "Reset iBouge password",
              "https://localhost:3000/#/newpassword?token=" + encodeURIComponent(hashToken),
              60,
            )
            .then(
              function (info) {
                console.log("email sent:", hashToken);
              },
              function (err) {
                console.log("email sent failed:", err);
              },
            );

          user.save(function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          });
        },
      );
    });
  },

  createNewPassword: function (email, password, token) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email: email,
        },
        function (err, user) {
          if (err || !user) {
            return reject("User not found");
          }

          if (token != user.password_restore_token) {
            return reject("Invalid token");
          }

          user.password = util.createHash(password);

          user.save(function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          });
        },
      );
    });
  },

  getRememberMeUser: function (key) {
    return new Promise((resolve, reject) => {
      // console.log('key', key);
      User.findOne(
        {
          remember_me: key,
        },
        function (err, user) {
          if (err || !user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          return resolve(user);
        },
      );
    });
  },

  search: function (q, options) {
    return new Promise((resolve, reject) => {
      // console.log('q', q);
      var re = new RegExp("^" + q, "gi");
      // console.log("re: ", re);
      User.find(
        {
          is_activated: true,
          "privacy.is_profile_public": true,
          $or: [
            {
              fname: re,
            },
            {
              lname: re,
            },
          ],
        },
        function (err, users) {
          if (err || !users) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          return resolve(users);
        },
      );
    });
  },

  addFriendRequest: function (userId, friendId) {
    return new Promise((resolve, reject) => {
      var oids = [];
      oids = [userId, friendId].map((x) => mongoose.Types.ObjectId(x));

      User.find(
        {
          _id: {
            $in: oids,
          },
        },
        function (err, users) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          var user;
          var friend;

          for (var responseId in users) {
            var x = users[responseId];
            if (x.id == userId) user = x;
            else if (x.id == friendId) friend = x;
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          var friendRequests = user.friend_requests_sent ? user.friend_requests_sent : [];

          if (friendRequests.indexOf(friendId) < 0) {
            friendRequests.push(friendId);
          }

          user.friend_requests_sent = friendRequests;

          user.save(function (err) {
            if (err) {
              return reject({
                status: 500,
                message: "Internal server error",
              });
            }

            return resolve(user);
          });

          mailer.friendReqMail(user, friend);
        },
      );
    });
  },

  updateUserBookmarkedMicroblogs: function (userId, microblogRoom) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: userId,
        },
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          var microblogs = user.bookmarked_microblogs ? user.bookmarked_microblogs : [];

          for (var i = 0; i < microblogs.length; i++) {
            if (microblogRoom === microblogs[i]) {
              return reject({
                status: 401,
                message: "microblog has already been added",
              });
            }
          }

          if (microblogs.indexOf(microblogRoom) < 0) {
            microblogs.push(microblogRoom);
          }

          user.bookmarked_microblogs = microblogs;
          user.save(function (err) {
            if (err) {
              return reject({
                status: 500,
                message: "Internal server error",
              });
            }
            return resolve(user);
          });
        },
      );
    });
  },

  unbookmarkMicroblog: function (userId, microblogRoom) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: userId,
        },
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.update(
            {
              _id: userId,
            },
            {
              $pull: {
                bookmarked_microblogs: microblogRoom,
              },
            },
            function (err) {
              if (err) {
                // console.log('Update user failed :', err);
              }
            },
          );

          user.save(function (err) {
            if (err) {
              return reject({
                status: 500,
                message: "Internal server error",
              });
            }
            return resolve(user);
          });
        },
      );
    });
  },

  getUserProfile: function (myId, userId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.findOne(
            {
              _id: userId,
            },
            function (err, profileUser) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              if (!profileUser) {
                return reject({
                  status: 404,
                  message: "User not found",
                });
              }

              // check if friend
              Friend.findOne(
                {
                  users: {
                    $all: [myId, userId],
                  },
                },
                function (err, friend) {
                  var friend_status = -1;
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  if (!friend) {
                    if (profileUser.friend_requests_sent && profileUser.friend_requests_sent.indexOf(myId) > -1) {
                      friend_status = 2;
                    } else if (user.friend_requests_sent && user.friend_requests_sent.indexOf(userId) > -1) {
                      friend_status = 1;
                    }
                  } else {
                    friend_status = 0;
                  }

                  var res = {
                    user: profileUser,
                    friend_status: friend_status,
                  };

                  return resolve(res);
                },
              );
            },
          );
        },
      );
    });
  },

  acceptFriendRequest: function (myId, userId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.findOne(
            {
              _id: userId,
            },
            function (err, friendUser) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              if (!friendUser) {
                return reject({
                  status: 404,
                  message: "User not found",
                });
              }

              // check if friend
              Friend.findOne(
                {
                  users: {
                    $all: [myId, userId],
                  },
                },
                function (err, friend) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  if (!friend) {
                    var newFriend = new Friend();
                    newFriend.users = [myId, userId];
                    newFriend.date = Date.now();
                    newFriend.save(function (err) {
                      if (err) {
                        return reject({
                          status: 500,
                          message: "Internal server error",
                        });
                      }

                      // update friendUser's document
                      User.update(
                        {
                          _id: userId,
                        },
                        {
                          $pullAll: {
                            friend_requests_sent: [myId],
                          },
                        },
                        function (err) {
                          if (err) {
                            // console.log('Update friend user faild :', err);
                          }
                        },
                      );

                      return resolve(user);
                    });
                  } else {
                    return resolve(user);
                  }
                },
              );
            },
          );
        },
      );
    });
  },

  unfriend: function (myId, userId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.findOne(
            {
              _id: userId,
            },
            function (err, friendUser) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              if (!friendUser) {
                return reject({
                  status: 404,
                  message: "User not found",
                });
              }

              // check if friend
              Friend.findOne(
                {
                  users: {
                    $all: [myId, userId],
                  },
                },
                function (err, friend) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  if (friend) {
                    friend.remove(
                      {
                        users: [myId, userId],
                      },
                      function (err) {
                        if (err) {
                          return reject({
                            status: 500,
                            message: "Internal server error",
                          });
                        }

                        // update friendUser's document
                        // User.update({'_id': userId}, {
                        //     $pullAll: {'friend_requests_sent': [myId]}
                        // }, function(err) {
                        //     if (err) {
                        //         // console.log('Update friend user faild :', err);
                        //     }
                        // });
                        return resolve(user);
                      },
                    );
                  } else {
                    return resolve(user);
                  }
                },
              );
            },
          );
        },
      );
    });
  },

  getInbox: function (myId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, _user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!_user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.update(
            {
              _id: myId,
            },
            {
              $set: {
                inbox_last_viewed_time: Date.now(),
              },
            },
            function (err) {
              if (err) {
                // console.log('update user failed :', err);
              }
            },
          );

          Chat.find(
            {
              "users.user_id": myId,
              messages: {
                $exists: true,
                $ne: [],
              },
            },
            {
              messages: {
                $slice: [0, 1],
              },
            },
            {
              sort: {
                last_updated_date: -1,
              },
            },
            function (err, chats) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              // get images
              // get all users to load exept me
              var tempArr = [];

              for (var i = 0; i < chats.length; i++) {
                var _users = chats[i].users
                  .filter(function (item) {
                    return item.user_id != myId && tempArr.indexOf(item.user_id) < 0;
                  })
                  .map(function (item) {
                    return item.user_id;
                  });
                tempArr = tempArr.concat(_users);
              }

              User.find(
                {
                  _id: {
                    $in: tempArr,
                  },
                },
                function (err, users) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  var resArr = [];
                  for (var i = 0; i < chats.length; i++) {
                    try {
                      var chatItem = chats[i];

                      if (!chatItem.is_group_chat) {
                        var otherUserId = chatItem.users.filter(function (item) {
                          return item.user_id != myId;
                        })[0];
                        var otherUser = users.filter(function (item) {
                          return item._id == otherUserId.user_id;
                        })[0];

                        resArr.push({
                          created_date: chatItem.created_date,
                          is_group_chat: false,
                          messages: chatItem.messages,
                          room: chatItem.room,
                          users: chatItem.users,
                          _id: chatItem._id,
                          name: otherUser.fname + " " + otherUser.lname,
                          image: otherUser.profile_pic,
                          is_online: otherUser.is_online,
                        });
                      } else {
                        var userIds = chatItem.users.map(function (item) {
                          return item.user_id;
                        });
                        var images = [];

                        for (var n = 0; n < users.length; n++) {
                          var _id = users[n]._id.toString();
                          if (userIds.indexOf(_id) > -1) {
                            images.push(users[n].profile_pic);
                          }
                        }

                        if (images.indexOf(_user.profile_pic) < 0) {
                          images.push(_user.profile_pic);
                        }

                        resArr.push({
                          created_date: chatItem.created_date,
                          is_group_chat: true,
                          messages: chatItem.messages,
                          room: chatItem.room,
                          users: chatItem.users,
                          _id: chatItem._id,
                          name: chatItem.name,
                          images: images,
                        });
                      }
                    } catch (e) {
                      // console.log('inbox error : ', e);
                    }
                  }
                  return resolve(resArr);
                },
              );
            },
          );
        },
      );
    });
  },

  getMicroblogs: function (myId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, _user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!_user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          // User.update({'_id': myId}, {$set: {'inbox_last_viewed_time': Date.now()}},
          //     function(err) {
          //         if (err) {
          //             // console.log('update user failed :', err);
          //         }
          //     });

          var microblogs = _user.bookmarked_microblogs;

          Microblog.find(
            {
              room: microblogs,
            },
            // , 'messages': {$exists: true, $ne: []}},
            // , {messages: {$slice: [0, 1]}},
            // {sort: {'last_updated_date': -1}},
            function (err, microblogs) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }

              // get images
              // get all users to load except me
              var tempArr = [];

              for (var i = 0; i < microblogs.length; i++) {
                var _users = microblogs[i].users
                  .filter(function (item) {
                    return item.user_id != myId && tempArr.indexOf(item.user_id) < 0;
                  })
                  .map(function (item) {
                    return item.user_id;
                  });
                tempArr = tempArr.concat(_users);
              }

              User.find(
                {
                  _id: {
                    $in: tempArr,
                  },
                },
                function (err, users) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  var resArr = [];
                  for (var i = 0; i < microblogs.length; i++) {
                    try {
                      var microblogItem = microblogs[i];

                      if (!microblogItem.is_microblog) {
                        var otherUserId = microblogItem.users.filter(function (item) {
                          return item.user_id != myId;
                        })[0];
                        var otherUser = users.filter(function (item) {
                          return item._id == otherUserId.user_id;
                        })[0];

                        resArr.push({
                          created_date: microblogItem.created_date,
                          is_microblog: false,
                          messages: microblogItem.messages,
                          room: microblogItem.room,
                          users: microblogItem.users,
                          _id: microblogItem._id,
                          name: otherUser.fname + " " + otherUser.lname,
                          image: otherUser.profile_pic,
                          is_online: otherUser.is_online,
                        });
                      } else {
                        var userIds = microblogItem.users.map(function (item) {
                          return item.user_id;
                        });
                        var images = [];

                        for (var n = 0; n < users.length; n++) {
                          var _id = users[n]._id.toString();
                          if (userIds.indexOf(_id) > -1) {
                            images.push(users[n].profile_pic);
                          }
                        }

                        if (images.indexOf(_user.profile_pic) < 0) {
                          images.push(_user.profile_pic);
                        }

                        resArr.push({
                          created_date: microblogItem.created_date,
                          is_microblog: true,
                          messages: microblogItem.messages,
                          room: microblogItem.room,
                          users: microblogItem.users,
                          microblogImage: microblogItem.microblog_img,
                          _id: microblogItem._id,
                          name: microblogItem.name,
                          images: images,
                        });
                      }
                    } catch (e) {
                      // console.log('inbox error : ', e);
                    }
                  }
                  return resolve(resArr);
                },
              );
            },
          );
        },
      );
    });
  },

  getNotifications: function (myId) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: myId,
        },
        function (err, user) {
          if (err) {
            return reject({
              status: 500,
              message: "Internal server error",
            });
          }

          if (!user) {
            return reject({
              status: 404,
              message: "User not found",
            });
          }

          User.update(
            {
              _id: myId,
            },
            {
              $set: {
                notifications_last_viewed_time: Date.now(),
              },
            },
            function (err) {
              if (err) {
                // console.log('update user failed :', err);
              }
            },
          );

          Notification.find(
            {
              recipients: {
                $in: [myId],
              },
            },
            null,
            {
              sort: {
                date: -1,
              },
            },
            function (err, notifications) {
              if (err) {
                return reject({
                  status: 500,
                  message: "Internal server error",
                });
              }
              var userIds = [];
              var notifUserMap = {};
              var images = [];
              for (var i = 0; i < notifications.length; i++) {
                var notification = notifications[i];
                var meta = notification.meta;
                var key = null;
                var type = notification.type;
                switch (type) {
                  case "friend-request":
                    key = "from";
                    break;
                  case "create-group-chat":
                    key = "created_by";
                    break;
                  case "accept-friend-request":
                    key = "from";
                    break;
                  case "invite-friend-to-microblog":
                    key = "created_by";
                    break;
                  case "like-request":
                    key = "from";
                    break;
                  case "reply-request":
                    key = "from";
                    break;
                }
                for (var n = 0; n < meta.length; n++) {
                  if (meta[n].key == key) {
                    var userId = meta[n].value;
                    notifUserMap[notification._id.toString()] = userId;
                    if (userIds.indexOf(userId) < 0) {
                      userIds.push(userId);
                    }
                    break;
                  }
                }
              }

              // load users images
              User.find(
                {
                  _id: {
                    $in: userIds,
                  },
                },
                ["profile_pic"],
                function (err, users) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: "Internal server error",
                    });
                  }

                  var clinedNotifications = [];
                  for (var m = 0; m < notifications.length; m++) {
                    var clonedNotification = notifications[m].getJSON();
                    for (var t = 0; t < users.length; t++) {
                      if (notifUserMap[clonedNotification._id] == users[t]._id) {
                        clonedNotification.image = users[t].profile_pic;
                        break;
                      }
                    }
                    clinedNotifications.push(clonedNotification);
                  }

                  return resolve(clinedNotifications);
                },
              );
            },
          );
        },
      );
    });
  },
};
