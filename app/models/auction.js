'use strict';

var Mongo = require('mongodb'),
    async = require('async');

function Auction(){
}

Object.defineProperty(Auction, 'collection', {
  get: function(){return global.mongodb.collection('auctions');}
});

Auction.findByOwnerId = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Auction.collection.find({ownerId: ownerId}).toArray(cb);
};

//Dave Note: Decided to call this more closely related to what it will be doing
Auction.displayAuction = function(id, cb){
  var auctionId = Mongo.ObjectID(id);
  Auction.collection.findOne({_id: auctionId}, function(err, auction){
    if(!auction.bids.length) { return cb(auction);}
    async.map(auction.bids, itemIterator, function(err, bidItems){ 
      async.map(bidItems, bidderIterator, function(err, bidders){ 
        auction.itemsForBid = bidItems;
        auction.itemOwners = bidders;
        cb(auction); 
      });
    });
  });
};

module.exports = Auction;

//Private Functions
function itemIterator(itemId, cb){
  var itemsList;
  require('./item').findById(itemId, function(err, item){
    itemsList = item;
    cb(null, itemsList);
  });
}

function bidderIterator(bidder, cb){
  var itemOwners;
  require('./user').findById(bidder.ownerId, function(err, owner){
    itemOwners = owner;
    cb(null, itemOwners);
  });
}


