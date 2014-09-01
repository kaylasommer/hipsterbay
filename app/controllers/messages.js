'use strict';

var User = require('../models/user');

exports.new = function(req, res){
  console.log(req.params.receiverId);
  User.findById(req.params.receiverId, function(user){
    res.render('messages/new-message', {receiver: user});
  });
};
