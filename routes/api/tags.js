var router = require('express').Router();
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

// return a list of tags
router.get('/', function(req, res, next) {
  Photo.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
