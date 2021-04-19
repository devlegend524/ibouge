var mongoose = require('mongoose');
var Event = mongoose.model('Event');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load fs to read incoming file
var fs = require('fs');
// Load randomatic library
var randomize = require('randomatic');
var path = require('path');
var dirPath = path.join(__dirname, '../../config/config.json');

// credentials for AWS SDK
AWS.config.loadFromPath(dirPath);

// global variable for bucket
var s3bucket = new AWS.S3({});

module.exports = {
  // get all events from all users
  getAllEvents: function () {
    return new Promise((resolve, reject) => {
      var date = new Date();
      date.setDate(date.getDate() - 1);

      // find all events im database
      Event.find({dateOfEvent: {$gte: date}}, function (err, events) {
        // if there's an error finding them
        // return the error and message
        if (err) {
          return reject({
            status: 500,
            message: 'Internal Sever error',
          });
        }

        // if no events were found inform the user
        if (!events) {
          return reject({
            status: 404,
            message: 'Events not found',
          });
        }

        // events were found
        // send them back to user
        return resolve(events);
      });
    });
  },

  // this will get all events either created by or joined by client
  getUsersEvents: function (id) {
    // return a promise with all events
    return new Promise((resolve, reject) => {
      // if there is no client id then nothing can be found
      if (!id) {
        // return error message
        return reject({status: 401, message: 'id not provided'});
      }

      // find all of the events created by the user or that the user has marked as 'going'
      Event.find(
        {$or: [{createdBy: id}, {'going.userId': id}]},
        function (err, events) {
          if (err) {
            return reject({status: 500, message: 'Internal server error'});
          }

          if (!events) {
            return reject({status: 404, message: 'Events not found'});
          }

          return resolve(events);
        }
      );
    });
  },

  // this will get one event given its ObjectID
  getEventById: function (id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject({status: 401, message: 'id not provided'});
      }

      Event.findById(id, function (err, event) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!event) {
          return reject({status: 404, message: 'Event not found'});
        }

        return resolve(event);
      });
    });
  },

  // this is the function that saves eventImage first to the s3 bucket and then creates a new event, given all the data required
  createEvent: function (data) {
    // if data does not exist, it will send an error message
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject({status: 401, message: 'event name not found'});
      }

      // if a file was received, this will save the picture first then create and save the new event
      if (data.file) {
        // this will hold the string given back by the s3bucket.load function
        var linkToPhoto = '';

        // name of the album + a forward slash
        var albumPhotosKey = encodeURIComponent(data.albumName) + '/';

        // this will hold the random generated string
        var generatedString = '';

        // while the generatedString is empty
        while (generatedString === '') {
          // get current time
          var currentTime = new Date().getTime();

          // turn current time into a string
          var toStringDate = currentTime.toString();

          // pass date string to randomize to get 15 character random string
          generatedString = randomize(toStringDate, 15);
        }

        // if generatedString is no longer empty
        if (generatedString !== '') {
          // produce photo object key
          var photoKey = albumPhotosKey + data.userId + '_' + generatedString;

          // read the file to then upload to s3bucket
          fs.readFile(data.file.path, function (err, fileData) {
            if (err) {
              throw err;
            }

            var params = {
              Bucket: 'ibouge',
              Key: photoKey,
              Body: fileData,
              ACL: 'public-read',
            };

            // upload photo to s3bucket
            s3bucket.upload(params, function (err, photo) {
              // if error occurs
              if (err) {
                console.log(
                  'error happened while saving file to S3 Bucket: ',
                  err
                );
                return reject({status: 500, message: 'Internal server error'});
              }

              // if photo saves successfully
              else {
                // photo.Location is set to linkToPhoto
                linkToPhoto = photo.Location;

                // we create the new event here
                var newEvent = new Event({
                  createdBy: data.event.createdBy,
                  createdDate: Date.now(),
                  name: data.event.name,
                  category: data.event.category,
                  dateOfEvent: data.event.date,
                  eventStartTime: data.event.startTimeOfEvent,
                  eventEndTime: data.event.endTimeOfEvent,
                  description: data.event.eventDescription,
                  location: {
                    address1: data.event.address1,
                    address2: data.event.address2,
                    city: data.event.city,
                    state: data.event.state,
                    country: data.event.country,
                    zip: data.event.zip,
                    coordinates: data.event.coordinates,
                  },
                  eventImage: linkToPhoto,
                  likes: [],
                  going: [
                    {
                      userId: data.event.userGoing,
                      confirmationDate: data.event.confirmationDate,
                    },
                  ],
                });

                // save event
                newEvent.save(function (err) {
                  if (err) {
                    return reject({
                      status: 500,
                      message: 'Internal server error',
                    });
                  }

                  return resolve(newEvent);
                });
              }
            });
          });
        }
      } else {
        // if no picture was received we create the new event here
        var newEvent = new Event({
          createdBy: data.event.createdBy,
          createdDate: Date.now(),
          name: data.event.name,
          category: data.event.category,
          dateOfEvent: data.event.date,
          eventStartTime: data.event.startTimeOfEvent,
          eventEndTime: data.event.endTimeOfEvent,
          description: data.event.eventDescription,
          location: {
            address1: data.event.address1,
            address2: data.event.address2,
            city: data.event.city,
            state: data.event.state,
            country: data.event.country,
            zip: data.event.zip,
            coordinates: data.event.coordinates,
          },
          eventImage: 'img/noImageAvailable.jpg',
          likes: [],
          going: [
            {
              userId: data.event.userGoing,
              confirmationDate: data.event.confirmationDate,
            },
          ],
        });

        // save event
        newEvent.save(function (err) {
          if (err) {
            console.log(err);
            return reject({status: 500, message: 'Internal server error'});
          }

          return resolve(newEvent);
        });
      }
    });
  },

  // this will save the event image to the database
  saveEventImage: function (eventID, image) {
    Event.updateOne(
      {_id: eventID},
      {
        $set: {
          eventImage: image,
        },
      },
      function (err) {
        if (err) {
          console.log('event image error:', err);
        }
      }
    );
  },

  // this will add a "like" to an event, when a person clicks the heart
  addLikeToEvent: function (eventId, like) {
    Event.updateOne(
      {_id: eventId},
      {
        $push: {
          likes: {
            $each: [{user: like.from, date: like.when}],
            $position: 0,
          },
        },
      },
      function (err) {
        if (err) {
          console.log('err adding like: ', err);
        }
      }
    );
  },

  // if a person has already liked an event, but they click the heart again, it will remove their like
  removeLikeFromEvent: function (eventId, user) {
    Event.updateOne(
      {_id: eventId},
      {
        $pull: {
          likes: {
            user: user,
          },
        },
      },
      function (err) {
        if (err) {
          console.log('err removing like: ', err);
        }
      }
    );
  },

  // this will add the user to the "going" array
  addUserGoing: function (eventId, user) {
    return new Promise((resolve, reject) => {
      if (!eventId) {
        return reject({status: 401, message: 'id not provided'});
      }

      Event.findById(eventId, ['going'], function (err, event) {
        if (err) {
          return reject({status: 500, message: 'Internal server error'});
        }

        if (!event) {
          return reject({status: 404, message: 'Event not found'});
        }

        // if the "going" array is empty, it will add the user automatically
        if (event.going.length === 0) {
          Event.updateOne(
            {_id: eventId},
            {
              $push: {
                going: {
                  $each: [{userId: user, confirmationDate: Date.now()}],
                  $position: 0,
                },
              },
            },
            function (err) {
              if (err) {
                console.log('error adding user going to event: ', err);
              }
            }
          );

          // if the "going" array is not empty, we check weather the user is already in the array or not
        } else {
          var users = event.going;

          for (var i = 0; i < users.length; i++) {
            // if user is already "going" to the event, we return a status of 401 and we do not add user
            if (user === users[i].userId) {
              return reject({
                status: 401,
                message: 'user is already going to event',
              });
              // if user is not in the "going" array, we add them to it
            } else {
              Event.updateOne(
                {_id: eventId},
                {
                  $push: {
                    going: {
                      $each: [{userId: user, confirmationDate: Date.now()}],
                      $position: 0,
                    },
                  },
                },
                function (err) {
                  if (err) {
                    console.log('error adding like to event: ', err);
                  }
                }
              );
            }
          }
        }
      });
    });
  },

  // this removes the user from the "going" array, this happens when they click the "not going" button in the event
  // page
  removeUserGoing: function (eventId, user) {
    Event.updateOne(
      {_id: eventId},
      {
        $pull: {
          going: {
            userId: user,
          },
        },
      },
      function (err) {
        if (err) {
          console.log('err removing user going: ', err);
        }
      }
    );
  },
};
