var fs = require('fs');

// Charlie changed
// var BASE = '/home/ubuntu/ibouge2';
var BASE = '';
module.exports = {
	createFile: function(name, content, path) {

		return new Promise((resolve, reject) => {
			if (!name || name == '') {
				return reject('File name not found');
			}

			var dir = BASE;

			if (path && path !== '') {
				dir += path;
			}

			dir += '/' + name;

			fs.writeFile(dir, content, function (err) {
				if (err) {
					return reject(err);
				} else {
					return resolve('OK');
				}
			});
		});
	}
};
