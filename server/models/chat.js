// chat model

var mongoose = require('mongoose');

var message = new mongoose.Schema({
	from: String,
	message_type: { type: String, default: 'text' },
	message: { type: String, default: '' },
	time: { type: Date, default: Date.now },
	read_at: { type: Date, default: null }
});

var user = new mongoose.Schema({
	user_id: String,
	last_login: Date,
	last_logout: Date
});

var chatSchema = new mongoose.Schema({
	name: String,
	created_by: String,
	room: String,
	users: [user],
	is_group_chat: { type: Boolean, default: false },
	messages: [message],
	last_updated_date: { type: Date, default: Date.now },
	created_date: { type: Date, default: Date.now }
});

chatSchema.methods.getJSON = function() {
	var newChat = {
		_id: this._id,
		name: this.name,
		created_by: this.created_by,
		room: this.room,
		users: getUsersJSON(this.users),
		is_group_chat: this.is_group_chat,
		messages: [],
		created_date: this.created_date
	};

	return newChat;
};

mongoose.model('Chat', chatSchema);

function getUsersJSON(_users) {
	if (!_users) {
		return [];
	}
	
	var users = [];
	for (var i = 0; i < _users.length; i++) {
		var user = {
			user_id: _users[i].user_id,
			last_login: _users[i].last_login,
			last_logout: _users[i].last_logout
		};
		
		users.push(user);
	}
	
	return users;
}
