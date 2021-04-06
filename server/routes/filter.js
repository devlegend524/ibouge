var express = require('express');
var filter = require('../controllers/filter');
var router = express.Router();

router.get('', function(req, res) {
	try {
		filter.search(req.query.q, req.query.documents).then(function(result) {
			res.send(result)
		}, function(err) {
			res.status(err.status).send(err.message);
		});
	} catch (e) {
		res.status(500).send('Internal server error');
	}
});

module.exports = router;
