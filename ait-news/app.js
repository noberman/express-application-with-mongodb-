// app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('./db');
const mongoose = require('mongoose');
const Link = mongoose.model('Link');
const Comment = mongoose.model('Comment');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));

// app.get('/home', (req,res) => {
//   link.find(function(err,link, count){
//     res.render('index');
//   });
// });

app.get('/home', (req,res) => {
  Link.find({}, (err,links) => {
    res.render('index', {links: links});
  });
});
app.get('/home/:slug', (req,res) => {
  res.send(req.param.slug);
  res.render('comments');
});

// app.post('/home/:slug', (req,res) => {
//   new Comment({
//     user: req.body.user,
//     test: req.body.text
//   }).save(function(err){
//     console.log(err);
//     res.redirect('/home/:slug');
//   });
// });

app.post('/home', (req,res) => {
  console.log(req.body.title);
new Link({
    url: req.body.url,
    title: req.body.title,
    //comments: req.body.comments
  }).save(function(err){
    console.log(err);
    res.redirect('/');
  });
});

app.get('/',(req,res) => {
  res.redirect('/home');
});


// LISTEN ON PORT 3000
app.listen(3000);
