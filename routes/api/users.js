var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var multer = require('multer');
var path = require('path');
var utils = require('../../utils');
var cloudinary = utils.cloudinary;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/images/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

var upload = multer({storage: storage, fileFilter: utils.imageFilter});

router.get('/user', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.put('/user', [auth.required, upload.single('image')], function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    var shouldUploadImage = false;

    if (!user) {
      return res.sendStatus(401);
    }

    // only update fields that were actually passed...
    if (typeof req.body.username !== 'undefined') {
      user.username = req.body.username;
    }
    if (typeof req.body.email !== 'undefined') {
      user.email = req.body.email;
    }
    if (typeof req.body.bio !== 'undefined') {
      user.bio = req.body.bio;
    }
    if (typeof req.body.password !== 'undefined') {
      user.setPassword(req.body.password);
    }

    if (typeof req.file !== 'undefined') {
      shouldUploadImage = true;
      user.image = '/uploads/images/avatar/' + req.file.filename;
    }

    if (shouldUploadImage) {
      cloudinary.uploader.upload('./public' + user.image, function (result) {
        // fetch data from cloudinary
        user.imageUrl = result.url;

        // save to db
        return user.save().then(function () {
          return res.json({user: user.toAuthJSON()});
        });
      });
    } else {
      return user.save().then(function () {
        return res.json({user: user.toAuthJSON()});
      });
    }
  }).catch(next);
});

router.post('/users/login', function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if (!req.body.user.password) {
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/users', upload.single('image'), function (req, res, next) {
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.save().then(function () {
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

module.exports = router;
