// status updates model

var mongoose = require('mongoose');

var like = new mongoose.Schema({
  from: String,
  date: Date
});

var reply = new mongoose.Schema({
  reply_type: { type: String, default: 'text' },
  message: { type: String, default: '' },
  caption: { type: String, default: '' },
  time: Date,
  from: String,
  size: String,
  filename: String,
  likes: [like]
});

var status = new mongoose.Schema({
  status_type: { type: String, default: 'text' },
  message: { type: String, default: '' },
  caption: { type: String, default: '' },
  time: Date,
  from: String,
  size: String,
  filename: String,
  likes: [like],
  replies: [reply]
});

var statusUpdateSchema = new mongoose.Schema({
  user: String,
  status: [status]
});

statusUpdateSchema.methods.getJSON = function() {
  var newStatus = {
    _id: this._id,
    user: this.user,
    status: []
  };

  return newStatus;
};

mongoose.model('statusUpdate', statusUpdateSchema);
