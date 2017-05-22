var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var auth = require('../auth');
var multer = require('multer');
var path = require('path');
var utils = require('../../utils');
var cloudinary = require('cloudinary');
var fs = require('fs');

cloudinary.config({
  cloud_name: 'dvu7qj3gw',
  api_key: '612387191157947',
  api_secret: 'DDwcT6OOV3Qehukc5aPvMz4-CNM'
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/images/photos')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

var upload = multer({storage: storage, fileFilter: utils.imageFilter});

// Preload photo objects on routes with ':photo'
router.param('photo', function (req, res, next, slug) {
  Photo.findOne({slug: slug})
    .populate('author')
    .then(function (photo) {
      if (!photo) {
        return res.sendStatus(404);
      }

      req.photo = photo;

      return next();
    }).catch(next);
});

router.param('comment', function (req, res, next, id) {
  Comment.findById(id).then(function (comment) {
    if (!comment) {
      return res.sendStatus(404);
    }

    req.comment = comment;

    return next();
  }).catch(next);
});

router.get('/', auth.optional, function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  if (typeof req.query.tag !== 'undefined') {
    query.tagList = {"$in": [req.query.tag]};
  }

  Promise.all([
    req.query.author ? User.findOne({username: req.query.author}) : null,
    req.query.favorited ? User.findOne({username: req.query.favorited}) : null
  ]).then(function (results) {
    var author = results[0];
    var favoriter = results[1];

    if (author) {
      query.author = author._id;
    }

    if (favoriter) {
      query._id = {$in: favoriter.favorites};
    } else if (req.query.favorited) {
      query._id = {$in: []};
    }

    return Promise.all([
      Photo.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('author')
        .exec(),
      Photo.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function (results) {
      var photos = results[0];
      var photosCount = results[1];
      var user = results[2];

      return res.json({
        photos: photos.map(function (photo) {
          return photo.toJSONFor(user);
        }),
        photosCount: photosCount
      });
    });
  }).catch(next);
});

router.get('/feed', auth.required, function (req, res, next) {
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    Promise.all([
      Photo.find({author: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(),
      Photo.count({author: {$in: user.following}})
    ]).then(function (results) {
      var photos = results[0];
      var photosCount = results[1];

      return res.json({
        photos: photos.map(function (photo) {
          return photo.toJSONFor(user);
        }),
        photosCount: photosCount
      });
    }).catch(next);
  });
});

// add new photo
router.post('/', [auth.required, upload.single('image')], function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    var photoReq = req.body || {};
    if (typeof req.file !== 'undefined') {
      photoReq.image = '/uploads/images/photos/' + req.file.filename;
    }

    var photo = new Photo(photoReq);
    photo.author = user;

    // after saved file, upload to cloudinary
    cloudinary.uploader.upload('./public' + photo.image, function (result) {
      // fetch data from cloudinary
      photo.url = result.url;
      photo.width = result.width;
      photo.height = result.height;
      photo.format = result.format;
      photo.secUrl = result.secure_url;
      photo.originalName = result.original_filename;

      // save to db
      return photo.save().then(function () {
        return res.json({photo: photo.toJSONFor(user)});
      });
    }, {
      public_id: photo.slug,
      tags: photo.tagList
    });


  }).catch(next);
});

// return a photo
router.get('/:photo', auth.optional, function (req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.photo.populate('author').execPopulate()
  ]).then(function (results) {
    var user = results[0];

    return res.json({photo: req.photo.toJSONFor(user)});
  }).catch(next);
});

// update photo
router.put('/:photo', [auth.required, upload.single('image')], function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.photo.author._id.toString() === req.payload.id.toString()) {
      if (typeof req.file !== 'undefined') {
        req.photo.image = '/uploads/images/photos/' + req.file.filename;
      }

      if (typeof req.body.title !== 'undefined') {
        req.photo.title = req.body.title;
      }

      if (typeof req.body.description !== 'undefined') {
        req.photo.description = req.body.description;
      }

      if (typeof req.body.tagList !== 'undefined') {
        req.photo.tagList = req.body.tagList;
      }

      req.photo.save().then(function (photo) {
        return res.json({photo: photo.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete photo
router.delete('/:photo', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    if (req.photo.author._id.toString() === req.payload.id.toString()) {
      return req.photo.remove().then(function () {
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// Favorite an photo
router.post('/:photo/favorite', auth.required, function (req, res, next) {
  var photoId = req.photo._id;

  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    return user.favorite(photoId).then(function () {
      return req.photo.updateFavoriteCount().then(function (photo) {
        return res.json({photo: photo.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// Unfavorite an photo
router.delete('/:photo/favorite', auth.required, function (req, res, next) {
  var photoId = req.photo._id;

  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    return user.unfavorite(photoId).then(function () {
      return req.photo.updateFavoriteCount().then(function (photo) {
        return res.json({photo: photo.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// return an photo's comments
router.get('/:photo/comments', auth.optional, function (req, res, next) {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
    return req.photo.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function (photo) {
      return res.json({
        comments: req.photo.comments.map(function (comment) {
          return comment.toJSONFor(user);
        })
      });
    });
  }).catch(next);
});

// create a new comment
router.post('/:photo/comments', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    var comment = new Comment(req.body);
    comment.photo = req.photo;
    comment.author = user;

    return comment.save().then(function () {
      req.photo.comments.push(comment);

      return req.photo.save().then(function (photo) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});

router.delete('/:photo/comments/:comment', auth.required, function (req, res, next) {
  if (req.comment.author.toString() === req.payload.id.toString()) {
    req.photo.comments.remove(req.comment._id);
    req.photo.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function () {
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
