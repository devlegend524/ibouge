var mongoose = require('mongoose');

var friendSchema = new mongoose.Schema({
	users: [String],
	date: Date
});

mongoose.model('Friend', friendSchema);
