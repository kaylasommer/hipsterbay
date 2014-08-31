'use strict';

var Mongo = require('mongodb');

function Auction(o){
  this.name          = o.name;
  this.bids          = [];
  this.offeredItemId = o.offeredItemId;
  this.ownerId       = o.ownerId;
  this.tag           = [];
}

Object.defineProperty(Auction, 'collection', {
  get: function(){return global.mongodb.collection('auctions');}
});

Auction.findByOwnerId = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Auction.collection.find({ownerId: ownerId}).toArray(cb);
};

Auction.create = function(o, cb){
  var auction = new Auction(o);
  Auction.collection.save(auction, cb);
};

module.exports = Auction;
