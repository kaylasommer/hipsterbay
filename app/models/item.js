'use strict';

var Mongo = require('mongodb');

function Item(o){
  this.name        = o.name;
  this.ownerId     = Mongo.ObjectID(o.ownerId);
  this.description = o.description;
  this.photo       = o.photo;

  this.isForOffer  = false;
  this.isForBid    = false;
  this.isAvailable = true;
}


Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.create = function(o, cb){
  var item = new Item(o);
  Item.collection.save(item, cb);
};

Item.findAvailable = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Item.collection.find({ownerId: ownerId, isAvailable: true}).toArray(cb);
};

Item.findById = function(id, cb){
  var itemId = Mongo.ObjectID(id);
  Item.collection.findOne({_id: itemId}, cb);
}


module.exports = Item;
