(function () {
  'use strict';

  var ids = {
    facebook: {
      clientID: '649780888559197',
      clientSecret: '40981aabfd61470726046f2d0d2b7c07',
      callbackURL: 'https://www.ibouge.com/auth/facebook/callback'
    },
    google: {
      clientID: '679558775060-ggdi7to1p31kinkmopjpkhbklgjabq8q.apps.googleusercontent.com',
      clientSecret: 'D-jzX-Gh8Qtr4PFH67qHIfRZ',
      callbackURL: 'https://www.ibouge.com/auth/google/callback'
    },
    twitter: {
      consumerKey: 'eDYftoW0GEv9ugFM0r4x61Kf5',
      consumerSecret: '2cGevewV56i5dUREyWtHgXRURogWuRX2lPjxUl59T7zlKRihda',
      callbackURL: 'https://www.ibouge.com/auth/twitter/callback'
    }
  };

  module.exports = ids;

})();
