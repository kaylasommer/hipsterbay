'use strict';

var async = require('async'),
    Mongo = require('mongodb'),
    _     = require('lodash'),
    User  = require('./user');


function Message(senderId, receiverId, message){
  this.senderId   = senderId;
  this.receiverId = receiverId;
  this.message    = message;
  this.date       = new Date();
  this.isRead     = false;
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});

Message.findByReceiverId = function(receiverId, cb){
  receiverId = Mongo.ObjectID(receiverId);
  Message.collection.find({receiverId:receiverId}).sort({date:-1}).toArray(function(err, messages){
    async.map(messages, iterator, cb);
  });
};

function iterator(message, cb){
  User.findById(message.senderId, function(sender){
    message.sender = sender;
    cb(null, message);
  });
}

Message.prototype.save = function(cb){
  Message.collection.save(this,cb);
};

Message.unread = function(receiverId, cb){
  Message.collection.find({receiverId:receiverId, isRead:false}).count(cb);
};

Message.findById = function(id, cb){
  id  = Mongo.ObjectID(id);
  Message.collection.findOne({_id:id},function(err, message){
    message = _.create(Message.prototype, message);
    cb(message);
  });
};

Message.send = function(senderId, receiverId, message, cb){
  var m = new Message(senderId, receiverId, message);
  Message.collection.save(m, cb);
};

module.exports=Message;
