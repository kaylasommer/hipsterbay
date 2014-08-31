'use strict';

var Mongo = require('mongodb');

function Item(o){
  this.name        = o.name;
  this.ownerId     = Mongo.ObjectID(o.ownerId);
  this.description = o.description;
  this.photo       = o.photo;

  //private properties
  this.isForOffer  = false;
  this.isForBid    = false;
  this.isAvailable = true;
}


Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.create = function(o, cb){
  console.log(o);
  var item = new Item(o);
  console.log(item);
  Item.collection.save(item, cb);
};

Item.findAvailable = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Item.collection.find({ownerId: ownerId, isAvailable: true}).toArray(cb);
};

Item.findById = function(itemId,  cb){
  var id = Mongo.ObjectID(itemId);
  Item.collection.findOne({_id: id}, cb);
};

Item.findByOwnerId = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Item.collection.find({ownerId: ownerId}).toArray(cb);
};

Item.deleteById = function(itemId, cb){
  var _id = Mongo.ObjectID(itemId);

  Item.collection.findAndRemove({_id:_id}, cb);
};


module.exports = Item;
