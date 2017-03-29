// app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('./db');
const mongoose = require('mongoose');
const Link = mongoose.model('Link');
const Comment = mongoose.model('Comment');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));

const sessionOptions = {
  secret: 'secret cookie thing',
  resave: true,
  saveUninitialized: true
}
app.use(session(sessionOptions));

//RENDERING THE LINKS
app.get('/home', (req,res) => {
  Link.find({}, (err,links) => {
    res.render('index', {links: links});
  });
});

//RENDERING COMMENT PAGE
app.get('/home/:slug', (req,res) => {
  //res.send(req.param.slug);
  //console.log(req.params.url);
  Link.findOne({slug: req.params.slug}, (err,link) => {
    //console.log(link.url);
    let lastC = req.session.lastComment;
    res.render('comments', {slug: req.params.slug, comments: link.comments, title: req.params.slug, url: link.url, lastC: lastC});
  });
});

//POST METHOD FOR COMMENTS FORM
app.post('/home/:slug', (req,res) => {
  Link.findOne({'slug': req.params.slug}, (err,link) => {
    if(err){
      console.log(err);
    }else{
      console.log(req.body.user);
      link.comments.push({user: req.body.user, text: req.body.text
      });
      link.save((saveErr, saveLink) => {
        if(err){
          console.log(err);
        }else{
          req.session.lastComment  = req.body.text;
          res.redirect(`/home/${req.params.slug}`);
        }
      });
    }
  });
});

//POST METHOD FOR ADDING A LINK TO THE PAGE
app.post('/home', (req,res) => {
  console.log(req.body.title);
new Link({
    url: req.body.url,
    title: req.body.title,
  }).save(function(err){
    console.log(err);
    res.redirect('/');
  });
});

//REDIRECT
app.get('/',(req,res) => {
  res.redirect('/home');
});

//css
app.get('/base.css', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/css','base.css'));
});

// LISTEN ON PORT 3000
app.listen(3000);
