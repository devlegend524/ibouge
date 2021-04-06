// notification model

var mongoose = require('mongoose');

var meta = new mongoose.Schema({
	key: String,
	value: String
});

var notification = new mongoose.Schema({
	type: String,
	text: String,
	date: Date,
	recipient_type: String,
	recipients: [String],
	meta: [meta]
});

notification.methods.getJSON = function() {
	var newNotification = {
		_id: this._id,
		type: this.type,
		text: this.text,
		date: this.date,
		recipient_type: this.recipient_type,
		recipients: this.recipients,
		meta: getMetaJSON(this.meta)
	};
	
	return newNotification;
}

mongoose.model('Notification', notification);

function getMetaJSON(_meta) {
	var meta = [];
	for (var i = 0; i < _meta.length; i++) {
		var metaItem = {
			key: _meta[i].key,
			value: _meta[i].value
		};
		
		meta.push(metaItem);
	}
	
	return meta;
}
