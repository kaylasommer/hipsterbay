'use strict';

var async = require('async'),
    Mongo = require('mongodb');

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

Message.send = function(senderId, receiverId, message, cb){
  var m = new Message(senderId, receiverId, message);
  Message.collection.save(m, cb);
};

module.exports=Message;
