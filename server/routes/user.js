var express = require('express');
var user = require('../controllers/user');
var notification = require('../controllers/notification');
var chat = require('../controllers/chat');
var router = express.Router();
var formidable = require('formidable');

GET_USER_META_MAX_AGE = 60;

router.get('/:portion', function (req, res) {
  try {
    // console.log('session user : ', req.session.user);
    switch (req.params.portion) {
      case 'friends':
        user.getFriends(req.query.id).then(
          function (friends) {
            res.send(friends);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'profile-friends':
        user.getProfileFriends(req.query.id, req.query.profile).then(
          function (friends) {
            res.send(friends);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'get-all-users':
        user.getAllUsers(req.query.id, req.query.limit, req.query.offset).then(
          function (users) {
            res.send(users);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'blocklist':
        user.getBlockList(req.query.email).then(
          function (blockList) {
            res.send(blockList);
          },
          function (err) {
            res.send(err);
          }
        );
        break;
      case 'inbox':
        /*
                getInbox(req.query.id).then(function(result) {
                	res.send(result);
                }, function(err) {
                	res.status(err.status).send(err.message);
                });
                */
        user.getInbox(req.query.id).then(
          function (result) {
            res.send(result);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'notifications':
        user.getNotifications(req.query.id).then(
          function (result) {
            res.send(result);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'microblogs':
        user.getMicroblogs(req.query.id).then(
          function (result) {
            res.send(result);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'profile':
        user.getUserProfile(req.query.id, req.query.user).then(
          function (userProfile) {
            res.send(userProfile);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'meta':
        user.getMeta(req.query.id).then(
          function (meta) {
            res.send(meta);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      case 'get-user-meta':
        user.getUserMeta(req.query.id).then(
          function (meta) {
            var user = meta.user;
            res.set(
              'Cache-Control',
              'public, max-age=' + GET_USER_META_MAX_AGE
            );
            res.send(user);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
      default:
        user.getUserById(req.params.portion).then(
          function (user) {
            res.send(user);
          },
          function (err) {
            res.status(err.status).send(err.message);
          }
        );
        break;
    }
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/profilepic/:email', function (req, res) {
  // since we are receiving a formData form we need to parse it with formidable
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var data = {
      userId: fields.userId,
      userEmail: fields.userEmail,
      albumName: fields.albumName,
    };

    if (files.file) {
      data.file = files.file;
    }

    if (files.originalFile) {
      data.originalFile = files.originalFile;
    }

    try {
      user.updateProfilePic(req.params.email, data).then(
        function (user) {
          res.send(user.profile_pic);
        },
        function (err) {
          res.sendStatus(err.status);
        }
      );
    } catch (e) {
      res.status(500).send('Internal server error');
    }
  });
});

router.post('/friend-request', function (req, res) {
  try {
    user.addFriendRequest(req.body.id, req.body.friend).then(
      function (user) {
        var data = {
          from: req.body.id,
          name: user.fname + ' ' + user.lname,
          to: req.body.friend,
        };
        notification.addNotification('friend-request', data);
        res.send('Successfully sent');
      },
      function (err) {
        res.status(err.status).send(err.message);
      }
    );
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/accept-friend-request', function (req, res) {
  try {
    user.acceptFriendRequest(req.body.id, req.body.user).then(
      function (user) {
        var data = {
          from: req.body.id,
          name: user.fname + ' ' + user.lname,
          to: req.body.user,
        };
        notification.addNotification('accept-friend-request', data);
        res.send('Successfully accepted');
      },
      function (err) {
        res.status(err.status).send(err.message);
      }
    );
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/unfriend', function (req, res) {
  try {
    user.unfriend(req.body.id, req.body.user).then(
      function () {
        res.send('Succesfully unfriended');
      },
      function (err) {
        res.status(err.status).send(err.message);
      }
    );
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/update-user-bookmarked-microblogs', function (req, res) {
  try {
    user.updateUserBookmarkedMicroblogs(req.body.me, req.body.room).then(
      function () {
        res.send('Successfully added');
      },
      function (err) {
        res.status(err.status).send(err.message);
      }
    );
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.post('/unbookmark-microblog', function (req, res) {
  try {
    user.unbookmarkMicroblog(req.body.me, req.body.room).then(
      function () {
        res.send('Successfully unbookmarked');
      },
      function (err) {
        res.status(err.status).send(err.message);
      }
    );
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.put('/:email', function (req, res) {
  user.updateUser(req.params.email, req.body).then(
    function (user) {
      res.send(user);
    },
    function (err) {
      res.send(err);
    }
  );
});

router.delete('/:email', function (req, res) {
  res.send({
    state: 'delete',
  });
});

/*
function getInbox(id) {
	//// console.log('getInbox :', id);
	return new Promise((resolve, reject) => {
		user.aById(id).then(function(_user) {

			chat.myInbox(_user._id).then(function(data) {

				// get images
				// get all users to load exept me
				var tempArr = [];

				for (var i = 0; i < data.length; i++) {
					var _users = data[i].users.filter(function(item) {
						return item.user_id != id && tempArr.indexOf(item.user_id) < 0;
					}).map(function(item) {
						return item.user_id;
					});
					tempArr = tempArr.concat(_users);
				}
				user.filter({_id: {$in: tempArr}}).then(function(users) {
					var resArr = [];
					for (var i = 0; i < data.length; i++) {
						try {
							var chatItem = data[i];

							if (!chatItem.is_group_chat) {
								var otherUserId = chatItem.users.filter(function(item) {
									return item.user_id != id;
								})[0];
								var otherUser = users.filter(function(item) {
									return item._id == otherUserId.user_id;
								})[0];


								resArr.push({
									created_date: chatItem.created_date,
									is_group_chat: false,
									messages: chatItem.messages,
									room: chatItem.room,
									users: chatItem.users,
									_id: chatItem._id,
									name: otherUser.fname + ' ' + otherUser.lname,
									image: otherUser.profile_pic,
									is_online: otherUser.is_online
								});
							} else {

								var userIds = chatItem.users.map(function(item) {
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
									images: images
								});

							}
						} catch (e) {
							// console.log('inbox error : ', e);
						}
					}
					return resolve(resArr);

				}, function(err) {
					return reject(err);
				});

			}, function(err) {
				return reject(err);
			});

		}, function(err) {
			return reject(err);
		});
	});
}
*/
module.exports = router;
