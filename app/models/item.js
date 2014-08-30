'use strict';



function Item(o){
  this.name        = o.name;
  this.ownerId     = o.ownerId;
  this.description = o.description;
  this.photo       = o.photo;

  //private properties
  this.isForOffer  = false;
  this.isForBig    = false;
  this.isAvailable = true;
}


Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('Item');}
});

Item.create = function(o, cb){
  var item = new Item(o);
  Item.collection.save(o, cb);
};


module.exports = Item;
