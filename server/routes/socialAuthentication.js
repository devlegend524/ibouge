(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();

  module.exports = function (passport) {

    router.get('/social/login-success', function(req,res) {
      var _user = req.user ? req.user: null;
      if (!_user) {
        res.send({state: 'failure', user: null, message: 'User not found'});
      } else if (!_user.is_activated) {
        res.send({state: 'failure', user: null, message: 'User not activated', resend: true});
      } else {
        req.session.email = _user.email;
        req.session.user = _user._id;
        res.redirect('https://localhost:3000/login');
        res.send({state: 'success', user: _user});
      }
    });

    // PASSPORT-FACEBOOK SIGNUP REQUEST && LOGIN
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }), function (req, res, next) {});

    router.get('/auth/facebook/callback', passport.authenticate('facebook'), function (req, res) {
      if (req.user.is_activated === false) {
        var redirectURL = 'https://localhost:3000/login?token=';
        res.redirect(redirectURL + req.user.activation_token);
      } else {
        res.redirect('/social/login-success');
      }
    });

    // PASSPORT-GOOGLE SIGNUP REQUEST
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), function (req, res, next) {});

    router.get('/auth/google/callback', passport.authenticate('google'), function (req, res) {
      if (req.user.is_activated === false) {
        var redirectURL = 'https://localhost:3000/login?token=';
        res.redirect(redirectURL + req.user.activation_token);
      } else {
        res.redirect('/social/login-success');
      }
    });

    // PASSPORT-TWITTER SIGNUP REQUEST
    router.get('/auth/twitter', passport.authenticate(('twitter')), function (req, res, next) {});

    router.get('/auth/twitter/callback', passport.authenticate('twitter'), function (req, res) {
      if (req.user.is_activated === false) {
        var redirectURL = 'https://localhost:3000/login?token='; // https://www.ibouge.com/#/
        res.redirect(redirectURL + req.user.activation_token);
      } else {
        res.redirect('/social/login-success');
      }
    });

    return router;
  }
})();
