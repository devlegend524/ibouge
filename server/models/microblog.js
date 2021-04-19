// microblog model

var mongoose = require('mongoose');

var message = new mongoose.Schema({
  from: String,
  message_type: {type: String, default: 'text'},
  message: {type: String, default: ''},
  time: {type: Date, default: Date.now},
});

var user = new mongoose.Schema({
  user_id: String,
  last_login: Date,
  last_logout: Date,
});

var invitation = new mongoose.Schema({
  from: String,
  to: String,
  when: {type: Date, default: Date.now},
});

var tempUser = new mongoose.Schema({
  user_id: String,
});

var microblogSchema = new mongoose.Schema({
  coordinates: Array,
  name: String,
  created_by: String,
  room: String,
  users: [user],
  microblog_img: String,
  is_microblog: {type: Boolean, default: false},
  messages: [message],
  friendsInvited: [invitation],
  allInvolved: [tempUser],
  last_updated_date: {type: Date, default: Date.now},
  created_date: {type: Date, default: Date.now},
});

microblogSchema.methods.getJSON = function () {
  var newMicroblog = {
    _id: this._id,
    coordinates: this.coordinates,
    name: this.name,
    created_by: this.created_by,
    room: this.room,
    users: getUsersJSON(this.users),
    microblog_img: this.microblog_img,
    uploaded_image: this.uploaded_image,
    is_microblog: this.is_microblog,
    messages: this.messages,
    friendsInvited: this.friendsInvited,
    allInvolved: this.allInvolved,
    created_date: this.created_date,
  };
  return newMicroblog;
};

mongoose.model('Microblog', microblogSchema);

function getUsersJSON(_users) {
  if (!_users) {
    return [];
  }

  var users = [];
  for (var i = 0; i < _users.length; i++) {
    var user = {
      user_id: _users[i].user_id,
      last_login: _users[i].last_login,
      last_logout: _users[i].last_logout,
    };

    users.push(user);
  }
  return users;
}
