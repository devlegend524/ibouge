var express = require('express');
var s3BucketCtrl = require('../controllers/amazonBucketController.js');
var router = express.Router();
var formidable = require('formidable');

router.post ('/image-to-album', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files) {
    var data = {
      albumName: fields.albumName,
      file: files.file,
      userId: fields.userId,
      filename: fields.filename
    };

    try {
      s3BucketCtrl.uploadDataToBucket(data).then(function(response) {
        res.send(response);
      }, function (err) {
        res.status(err.status).send(err.message);
      });
    } catch (e) {
      console.log('save image to album err: ', e);
      res.status(500).send('Internal server error');
    }
  });
});

module.exports = router;
