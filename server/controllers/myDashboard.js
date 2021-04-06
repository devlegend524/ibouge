var mongoose = require('mongoose');
var Friend = mongoose.model('Friend');
var User = mongoose.model('User');

module.exports = {
	getMeta: function(myId) {
		return new Promise((resolve, reject) => {
			var meta = {};
			
			Friend.count({'users': {$in: [myId]}},
			function(err, count) {
				if (err) {
					return reject({status: 500, message: 'Internal server error'});
				}
				
				meta['friends_count'] = count;
				return resolve(meta);
				
			});
		});
	}
}