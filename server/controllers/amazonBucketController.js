var mongoose = require('mongoose');
// var statusUpdate = mongoose.model('statusUpdate');
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs = require('fs');
var mime = require('mime-types');
const path = require('path');
var randomize = require('randomatic');
var jo = require('jpeg-autorotate');
var dirPath = path.join(__dirname, '../../config/config.json');

AWS.config.loadFromPath(dirPath);
var s3bucket = new AWS.S3({});

module.exports = {
  uploadDataToBucket: function (data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject({status: 401, message: 'not sufficient information'});
      }

      var path = data.file.path;

      jo.rotate(path, {}, function (error, buffer, orientation, dimensions) {
        var tempPath = null;

        if (error && error.code === jo.errors.correct_orientation) {
          console.log('The orientation of this image is already correct!');
        } else {
          const base64Data = buffer.toString('base64');
          tempPath = '/tmp/ibouge-uploads/' + randomize('A0', 20);
          var tempFilePath = path.join(__dirname, tempPath);

          fs.writeFileSync(tempFilePath, base64Data, 'base64');
        }

        var userId = data.userId;
        var albumPhotosKey = encodeURIComponent(data.albumName) + '/';

        // current time
        // var currentTime = new Date().getTime().toString();

        // generate random password based on current time
        var generatedString = randomize('A0', 20);

        var photoKey = albumPhotosKey + userId + '_' + generatedString;

        var mimeType = mime.lookup(data.filename);
        var isImage = false;
        var isVideo = false;

        if (mimeType.startsWith('image/')) {
          isImage = true;
        } else if (mimeType.startsWith('video/')) {
          isVideo = true;
        }

        if (isImage || isVideo) {
          if (tempPath) {
            path = tempPath;
          }
          fs.readFile(path, function (err, data) {
            if (err) {
              throw err;
            }

            if (tempPath) {
              fs.unlinkSync(tempPath);
            }

            var params = {
              Bucket: 'ibouge',
              Key: photoKey,
              Body: data,
              ACL: 'public-read',
            };

            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(
                  'error happened while saving file to S3 Bucket: ',
                  err
                );
                return reject({status: 500, message: 'Internal server error'});
              } else {
                data.type = mimeType.split('/')[0];
                data.mimeType = mimeType;

                console.log('Successfully uploaded data to ibouge bucket');
                return resolve(data);
              }
            });
          });
        } else {
          return reject({status: 401, message: 'Invalid file type'});
        }
      });
    });
  },
};
