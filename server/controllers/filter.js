var user = require('./user.js');

module.exports = {
	search: function(q, documents) {
		return new Promise((resolve, reject) => {
			var documentsArr = documents ? documents.split(',') : ['users'];
			var resultDocs = [];
			var resultArr = [];
			var result = {};
			for (var i = 0; i < documentsArr.length; i++) {
				var doc = documentsArr[i];
				if (!doc || doc == '') {
					continue;
				}
				
				switch (doc) {
				case 'users':
					resultDocs.push(doc);
					resultArr.push(user.search(q, documents));
					break;
				}
			}
			
			Promise.all(resultArr).then(function(data) {
				for (var i = 0; i < resultDocs.length; i++) {
					result[resultDocs[i]] = data[i];
				}
				resolve(result);
			}, function(err) {
				reject({status: 500, message: 'Internal server error'});
			});
		});
	}
}