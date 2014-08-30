'use strict';

var Mongo = require('mongodb');

function Item(o){
  this.name        = o.name;
  this.ownerId     = o.ownerId;
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
  var item = new Item(o);
  Item.collection.save(item, cb);
};

Item.findAvailable = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Item.collection.find({ownerId: ownerId}).toArray(cb);
};


module.exports = Item;
