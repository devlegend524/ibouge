var mongoose = require('mongoose');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');
var AWS = require('aws-sdk');
var path = require('path');
var dirPath = path.join(__dirname, '../../config/config.json');
// credentials for AWS SDK
AWS.config.loadFromPath(dirPath);

/* Support email address */
let SUPPORT_ADDRESS = "iBouge Support <support@ibouge.com>";
/* sendMail() will not send mail more than this often, unless throttleSecs set */
let DEFAULT_THROTTLE_SECS = 86400;

// lost password for ibougeconfirmation@gmail.com -- check with Charlie
// var transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'ibougeconfirmation@gmail.com',
//     pass: '67140A78b243'
//   }
// });

var transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01',
  })
});

// var transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'wapb1988428@gmail.com',
//     pass: '881193698'
//   }
// });

let sendMail = function(from, to, subject, body, throttleSecs)  {
  if (throttleSecs == undefined) {
    throttleSecs = DEFAULT_THROTTLE_SECS;
  }
  return new Promise((resolve, reject) => {
    User.findOne({email: to}, function(err, user) {
      if (user) {
        if (user.last_email_received) {
          now = Date.now()
          if (user.last_email_received > Date.now() - (throttleSecs * 1000)) {
            console.log("skipping email to", to, ", last_email_received is", user.last_email_received);
            return;
          }
        }
      }

      var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body
      };
      console.log('sending email:', mailOptions);
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return reject(error);
        } else {
          return resolve(info);
        }
      });

      if (user) {
        user.last_email_received = Date.now();
        user.save();
      }
    });
  });
};

let sendSupportMail = function(to, subject, body, throttleSecs) {
  return sendMail(SUPPORT_ADDRESS, to, subject, body, throttleSecs);
};

let introSubject = "Welcome to iBouge!";
let introBody = function (newUser, link) {
  let fname = ("fname" in newUser) ? newUser.fname : "";
  let text = `Hi ${fname},

Thank you for signing up with iBouge!

Please click the link below to confirm your registration. We hope you enjoy the site and for any feedback, please reach out to support@ibouge.com.

${link}

Sincerely,

The iBouge Team`;
    return text;
};

let friendReqMail = function(requestor, requestee) {
  let requestee_name = ("fname" in requestee) ? requestee.fname : "";
  let requestor_name = ("fname" in requestor) ? requestor.fname : "";
  subject = `${requestor_name} has sent you a friend request on iBouge!`;

  let body = `Hi ${requestee_name},

${requestor_name} has sent you a friend request on iBouge!

To accept the request, sign in at https://www.ibouge.com

Sincerely,

The iBouge Team`;
    
  sendMail(SUPPORT_ADDRESS, requestee.email, subject, body).then(function() {
    console.log('mail to', requestee.email, 'sent');
  }, function(error) {
    console.log('mail sending to', requestee.email, 'failed:', error);
  });
}

let chatNotificationMail = function(fromUser, toUser, isGroupChat, groupName) {
  let from_name = ("fname" in fromUser) ? fromUser.fname : "";
  let to_name = ("fname" in toUser) ? toUser.fname : "";

  if (isGroupChat) {
    subject = `${from_name} has sent a group chat message on iBouge!`;
    body_msg_type = "a group chat message"
  } else {
    subject = `${from_name} has sent you a message on iBouge!`;
    body_msg_type = "you a message"
  }

  let body = `Hi ${to_name},

${from_name} has sent ${body_msg_type} on iBouge!

To see the message, sign in at https://www.ibouge.com

Sincerely,

The iBouge Team`;
    
  sendMail(SUPPORT_ADDRESS, toUser.email, subject, body).then(function() {
    console.log('mail to', toUser.email, 'sent');
  }, function(error) {
    console.log('mail sending to', toUser.email, 'failed:', error);
  });
}

module.exports = {
  sendMail: sendMail,
  sendSupportMail: sendSupportMail,
  introSubject: introSubject,
  introBody: introBody,
  friendReqMail: friendReqMail,
  chatNotificationMail: chatNotificationMail,
  supportAddress: SUPPORT_ADDRESS
}
