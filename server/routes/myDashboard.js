var express = require('express');
var myDashboard = require('../controllers/myDashboard');
var router = express.Router();

router.get('/meta', function(req, res) {
	try {
		myDashboard.getMeta(req.query.id).then(function(result) {
			res.send(result)
		}, function(err) {
			res.status(err.status).send(err.message);
		});
	} catch (e) {
		res.status(500).send('Internal server error');
	}
});

module.exports = router;
