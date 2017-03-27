

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

//put SCHEMA here
const Schema = mongoose.Schema;


const Comment = new Schema({
  text: String,
  user: String
});

const Link = new Schema({
  url: String,
  title: String,
  comments: [Comment]

});

//slug definition goes here
Link.plugin(URLSlugs('title'));
Comment.plugin(URLSlugs('user'));

//registering Models
mongoose.model('Comment', Comment);
mongoose.model('Link', Link);

mongoose.connect('mongodb://localhost/hw5');
