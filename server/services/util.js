var bCrypt = require('bcrypt-nodejs');

module.exports = {
	createHash: function(password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	},
	
	isValidPassword: function(user, password) {
		return bCrypt.compareSync(password, user.password);
	},
	
	simpleClone: function(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
}
