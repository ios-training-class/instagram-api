var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var PhotoSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  image: String,
  favoritesCount: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

PhotoSchema.plugin(uniqueValidator, {message: 'is already taken'});

PhotoSchema.pre('validate', function(next){
  this.slugify();

  next();
});

PhotoSchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

PhotoSchema.methods.updateFavoriteCount = function() {
  var photo = this;

  return User.count({favorites: {$in: [photo._id]}}).then(function(count){
    photo.favoritesCount = count;

    return photo.save();
  });
};

PhotoSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    image: this.image,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Photo', PhotoSchema);
