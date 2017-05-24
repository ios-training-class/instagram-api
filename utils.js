var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dvu7qj3gw',
  api_key: '612387191157947',
  api_secret: 'DDwcT6OOV3Qehukc5aPvMz4-CNM'
});

var imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var errNotFound = function(res){
  return res.send(404, {error:'Not Found'});
};

var errUnAuthor = function(res){
  return res.send(401, {error:'Unauthorized'});
};

var errServer = function(res){
  return res.send(500, {error:'Server error'});
};

var errForbidden = function(res){
  return res.send(403, {error:'Forbidden'})
};

var sendSuccess = function(res){
  return res.send({status: 'OK'});
};

module.exports = {
  imageFilter: imageFilter,
  cloudinary: cloudinary,

  errorNotFound: errNotFound,
  errorUnauthorized: errUnAuthor,
  errorServer: errServer,
  errorForbidden: errForbidden,
  success: sendSuccess
};
