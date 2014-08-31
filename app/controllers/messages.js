'use strict';

var User = require('../models/user');

exports.new = function(req, res){
  User.findById(req.params.receiverId, function(user){
    res.render('messages/new-message', {receiver: user});
  });
};

exports.send = function(req, res){
  User.findById(req.params.receiverId, function(receiver){
    res.locals.user.send(receiver, req.body, function(){
      res.redirect('/auction/search');
    });
  });
};



