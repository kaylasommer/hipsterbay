'use strict';

var User = require('../models/user'),
    Message = require('../models/message'),
    moment = require('moment');

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('users/login');
  });
};

exports.create = function(req, res){
  var credentials = {
    email: req.body.email,
    password: req.body.password
  };
  User.register(credentials, function(err, user){
    User.authenticate(credentials, function(user){
      if(user){
        req.session.regenerate(function(){
          req.session.userId = user._id;
          req.session.save(function(){
            res.redirect('/user/profile');
          });
        });
      }else{
        res.redirect('/login');
      }
    });
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/user/profile');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.profile = function(req, res){
  User.findById(res.locals.user._id, function(user){
    res.render('users/profile', {user:user});
  });
};

exports.editProfile = function(req, res){
  res.locals.user.update(req.body, function(err, user){
    res.redirect('/user/profile');
  });
};

exports.inbox = function(req, res){
  Message.findByReceiverId(res.locals.user._id, function(err, messages){
    res.render('messages/inbox', {messages:messages, moment:moment});
  });
};

exports.toggleRead = function(req, res){
  Message.findById(req.params.messageId, function(message){
    message.isRead = !message.isRead;
    message.save(function(){
      res.redirect('/message/inbox');
    });
  });
};
