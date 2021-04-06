var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

module.exports = function(passport) {
	// sends successful login state back to view(angular)
	router.get('/login-success', function(req,res) {
		var _user = req.user ? req.user: null;
		if (!_user) {
			res.send({state: 'failure', user: null, message: 'User not found'});
		} else if (!_user.is_activated) {
			res.send({state: 'failure', user: null, message: 'User not activated', resend: true});
		} else {
			req.session.email = _user.email;
			req.session.user = _user._id;
      res.send({state: 'success', user: _user});
		}
  });

	router.get('/signup-success', function(req,res) {
    var flashObject = req.flash();
    var flashObjectProperty = flashObject[Object.keys(flashObject)[0]];
    var successMessage = flashObjectProperty[0];
		res.send({state: 'success', user: req.user ? req.user: null, message: successMessage });
  });

	// send failure login state back to view(angular)
	router.get('/failure', function(req,res) {
		var flashObject = req.flash();
		var flashObjectProperty = flashObject[Object.keys(flashObject)[0]];
		var failureMessage = flashObjectProperty.length > 0 ?flashObjectProperty[0]: flashObjectProperty;
		res.send({state: 'failure', user: null, message: failureMessage });
    });

	// PASSPORT-LOCAL LOGIN REQUEST
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/login-success',
		failureRedirect: '/auth/failure'
	}));

	// PASSPORT-LOCAL SIGNUP REQUEST
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/signup-success',
		failureRedirect: '/auth/failure'
	}));

	// logout request
	router.get('/signout', function(req, res) {
    req.session.user = null;
		req.session.email = null;
		req.logout();
		res.send({state: 'success'});
	});

	router.post('/resend-email', function(req, res) {
		user.resendEmail(req.body.email).then(function() {
			res.send({state: 'success'});
		}, function(err) {
			res.send({state: 'error'});
		});
	});

	router.post('/activate-account', function(req, res) {
		user.activate(req.body.token).then(function(user) {
			res.send({state: 'success'});
		}, function(err) {
			res.send({state: 'error'});
		});
	});

	router.post('/restore-password', function(req, res) {
		user.restorePassword(req.body.email).then(function(token) {
			res.send({state: 'success', message: 'Please check your email'});
		}, function(err) {
			res.send({state: 'error', message: err});
		});
	});

	router.post('/new-password', function(req, res) {
		user.createNewPassword(req.body.email, req.body.password, req.body.token).then(function(user) {
			res.send({state: 'success', message: 'Successfully reset your password! Logging in...'});
		}, function(err) {
			res.send({state: 'error', message: err});
		});
	});

	// get user from session
	router.get('/me', function(req, res) {
		try {
			user.getUserByEmail(req.session.email).then(function(user) {
				res.send(user);
			}, function(err) {
				res.status(err.status).send(err.message);
			});
		} catch (e) {
			res.status(500).send('Internal server error');
		}
	});

	// get remember me user
	router.get('/user', function(req, res) {
		try {
			user.getRememberMeUser(req.query.key).then(function(user) {
				res.send(user);
			}, function(err) {
				res.status(err.status).send(err.message);
			});
		} catch (e) {
			res.status(500).send('Internal server error');
		}
	});

	return router;
};
