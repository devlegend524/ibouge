var mongoose = require('mongoose');   
var Notification = mongoose.model('Notification');
var User = mongoose.model('User');

module.exports = {
	addNotification: function(type, data, cb) {
		switch (type) {
		case 'create-group-chat':
			createGroupChatNotification(type, data);
			break;
		case 'friend-request':
			friendRequestNotification(type, data);
			break;
		case 'accept-friend-request':
			acceptFriendRequestNotification(type, data);
			break;
		case 'invite-friend-to-microblog':
			inviteFriendToMicroblogNotification(type, data);
			break;
		case 'like-request':
			likeNotification(type, data, cb);
			break;
		case 'reply-request':
			replyNotification(type, data, cb);
			break;
		}
	}
};


function createGroupChatNotification(type, chat) {
	var userId = chat.created_by;
	if (userId) {
		User.findOne({'_id': userId}, 
		function(err, user) {
			if (user) {
				var text = user.fname + " " + user.lname + " created a Group Chat (" + chat.name + ")";
				var meta = [];
				meta.push({key: 'created_by', value: userId});
				meta.push({key: 'room', value: chat.room});
				
				var newNotification = new Notification();
				newNotification.type = type;
				newNotification.recipient_type = 'group';
				newNotification.recipients = chat.users.map(function(item) {return item.user_id;});
				newNotification.date = chat.created_date;
				newNotification.text = text;
				newNotification.meta = meta;
				
				newNotification.save(function(err) {
					if (err) {
						// console.log('notification save error :', err);
					}
					updateRecipients(newNotification._id, newNotification.recipients);
				});
				
			}
		});
	}
}

function friendRequestNotification(type, data) {
	var meta = [];
	meta.push({key: 'from', value: data.from});
	
	var newNotification = new Notification();
	newNotification.type = type;
	newNotification.recipient_type = 'individual';
	newNotification.recipients = [data.to];
	newNotification.date = Date.now();
	newNotification.text = 'You have a friend request from ' + data.name;
	newNotification.meta = meta;
	
	newNotification.save(function(err) {
		if (err) {
			// console.log('notification save error :', err);
		}
		updateRecipients(newNotification._id, newNotification.recipients);
	});
}

function acceptFriendRequestNotification(type, data) {
	var meta = [];
	meta.push({key: 'from', value: data.from});
	
	var newNotification = new Notification();
	newNotification.type = type;
	newNotification.recipient_type = 'individual';
	newNotification.recipients = [data.to];
	newNotification.date = Date.now();
	newNotification.text = data.name + ' accepted your friend request';
	newNotification.meta = meta;
	
	newNotification.save(function(err) {
		if (err) {
			// console.log('notification save error :', err);
		}
		updateRecipients(newNotification._id, newNotification.recipients);
	});
}

function inviteFriendToMicroblogNotification(type, data) {
	var userId = data.microblog.created_by;
	if (userId) {
		User.findOne({'_id': userId},
			function(err, user) {
                var text = user.fname + " " + user.lname + " has invited you to join a microblog";
                var meta = [];
                meta.push({key: 'created_by', value: userId});
                meta.push({key: 'room', value: data.microblog.room});

                var newNotification = new Notification();
                newNotification.type = type;
                newNotification.recipient_type = 'group';
                newNotification.recipients = data.friends;
                newNotification.date = Date.now();
                newNotification.text = text;
                newNotification.meta = meta;

                newNotification.save(function(err) {
                    if (err) {
                        // console.log('notification save error :', err);
                    }
                    updateRecipients(newNotification._id, newNotification.recipients);
                });
			})
	}
}

function replyNotification(type, data, cb) {
	var meta = [];
	meta.push({key: 'from', value: data.from});
	meta.push({key: 'post', value: data.post});
	
	var newNotification = new Notification();
	newNotification.type = type;
	newNotification.recipient_type = 'individual';
	newNotification.recipients = [data.to];
	newNotification.date = Date.now();
	newNotification.text = data.name + ' commented on your post.';
	newNotification.meta = meta;
	
	newNotification.save(function(err) {
		if (err) {
			console.log('notification save error :', err);
		}
		updateRecipients(newNotification._id, newNotification.recipients, data, cb);
	});
}

function likeNotification(type, data, cb) {
	var meta = [];
	meta.push({key: 'from', value: data.from});
	if (data.reply) {
		meta.push({key: 'reply', value: data.reply});
	} else {
		meta.push({key: 'post', value: data.post});
	}
	
	var newNotification = new Notification();
	newNotification.type = type;
	newNotification.recipient_type = 'individual';
	newNotification.recipients = [data.to];
	newNotification.date = Date.now();
	if (data.reply) {
		newNotification.text = data.name + ' liked your comment.';
	} else {
		newNotification.text = data.name + ' liked your post.';
	}
	newNotification.meta = meta;
	
	newNotification.save(function(err) {
		if (err) {
			console.log('notification save error :', err);
		}
		updateRecipients(newNotification._id, newNotification.recipients, data, cb);
	});
}

function updateRecipients(notificationId, recipients, data, cb) {
	var filter = {};
	if (recipients) {
		filter = {'_id': {$in: recipients}};
	}
	User.update(filter, {
		$push: {
			unread_notifications: {
				$each: [notificationId],
				$position: 0
			}
		}
	}, function(err) {
		if (err) {
			console.log('chat msg error :', err);
		} else {
			console.log('A new notification is added to the list of notifications for the user.');
		}
		if (cb) {
			cb(err, recipients, data);
		}
	});
}
