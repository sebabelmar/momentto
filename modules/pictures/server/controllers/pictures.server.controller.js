'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  request = require('request'),
  mongoose = require('mongoose'),
  Picture = mongoose.model('Picture'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Picture
 */
exports.create = function(req, res) {
  var picture = new Picture(req.body);
  picture.user = req.user;

  picture.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picture);
    }
  });
};

/**
 * Show the current Picture
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var picture = req.picture ? req.picture.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  picture.isCurrentUserOwner = req.user && picture.user && picture.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(picture);
};

/**
 * Update a Picture
 */
exports.update = function(req, res) {
  var picture = req.picture ;

  picture = _.extend(picture , req.body);

  picture.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picture);
    }
  });
};

/**
 * Delete an Picture
 */
exports.delete = function(req, res) {
  var picture = req.picture ;

  picture.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picture);
    }
  });
};

/**
 * List of Pictures
 */
exports.list = function(req, res) { 
  Picture.find().sort('-created').populate('user', 'displayName').exec(function(err, pictures) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pictures);
    }
  });
};

/**
 * Picture middleware
 */
exports.pictureByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Picture is invalid'
    });
  }

  Picture.findById(id).populate('user', 'displayName').exec(function (err, picture) {
    if (err) {
      return next(err);
    } else if (!picture) {
      return res.status(404).send({
        message: 'No Picture with that identifier has been found'
      });
    }
    req.picture = picture;
    next();
  });
};

/**
 * Import User's pics from Instagram
 */
exports.loadMedia = function(req, res){
    // https://api.instagram.com/v1/users/{user-id}/media/recent/?access_token=
    var user_info = req.user.providerData;
    var url =  "https://api.instagram.com/v1/users/" + user_info.id + "/media/recent/?access_token=" + user_info.accessToken;

    console.log(user_info);
    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var instagramPics = JSON.parse(body);
            var user_id = req.param('user_id');
            console.log("user_id");

            iterateOverResponse(instagramPics.data, req.user._id)
            return res.json(200)
        }else{
            console.log(error);
            console.log("algo anda mal!");
        }
    })
};

var iterateOverResponse = function(collection, userId){
    for( var i = 0; i < collection.length; i++ ) {
        savePicture(collection[i], userId);
    }
};

var savePicture = function(media, userId){
    console.log(media)
    var createdAt = new Date(media.created_time*1000)
    if(media.type == 'image'){
        var lowResUrl = media.images.low_resolution.url;
        var thumbnail = media.images.thumbnail.url;
        var standardUrl = media.images.standard_resolution.url;
        var videoStandardUrl = '';
        var videoLowUrl = '';

    }else{
        var lowResUrl = media.images.low_resolution.url;
        var thumbnail = media.images.thumbnail.url;
        var standardUrl = media.images.standard_resolution.url;
        var videoStandardUrl = media.videos.low_resolution.url;
        var videoLowUrl = media.videos.standard_resolution.url;
    }


    var picture = new Picture ({
        title: "Seba",
        takenAt: createdAt,
        tags : media.tags,
        mediaType: media.type,
        location: media.location,
        imageLowResUrl: lowResUrl,
        imageThumbnail: thumbnail,
        imageStandardUrl: standardUrl,
        videoStandardUrl: videoStandardUrl,
        videoLowUrl: videoLowUrl,
        instagramId: media.id,
        user: mongoose.Types.ObjectId(userId)
    });

    picture.save(function (err) {
        if (err) return console.log(err);
    })
};

/**
 * Saving Picture Memory
 */
exports.createMemory = function(req, res) {
    console.log("in memorie");

    var picture = req.picture ;
    console.log(picture);
    req.param('content');

    picture.memories.push({content: req.param('content')});

    picture.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log('Saved memory on pic...')
            res.jsonp(picture);
        }
    });
};
