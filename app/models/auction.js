'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    _     = require('lodash'),
    Item  = require('./item');

function Auction(){
}

Object.defineProperty(Auction, 'collection', {
  get: function(){return global.mongodb.collection('auctions');}
});

Auction.findByOwnerId = function(id, cb){
  var ownerId = Mongo.ObjectID(id);
  Auction.collection.find({ownerId: ownerId}).toArray(cb);
};

Auction.filterBySearchQuery = function(auctions, query){
  query = query.toLowerCase();
  var filtered = _.filter(auctions, function(auction){
    var name = auction.item.name.toLowerCase(),
        description = auction.item.description.toLowerCase();
    return _.contains(name, query) || _.contains(description, query);
  });
  return filtered;
};

Auction.findAll = function(query, cb){
  Auction.collection.find(query).toArray(function(err, auctions){
    async.map(auctions,
      function(auction, cb){
        Item.findById(auction.offeredItemId, function(err, item){
          auction.item = item;
          cb(null, auction);
        });
      }, cb);
  });
};

//Dave Note: Decided to call this more closely related to what it will be doing
Auction.displayAuction = function(id, cb){
  var auctionId = Mongo.ObjectID(id);
  Auction.collection.findOne({_id: auctionId}, function(err, auction){
    Item.findById(auction.offeredItemId, function(err, item){
      auction.itemForOffer = item;
      if(!auction.bids.length) { return cb(auction);}
      async.map(auction.bids, itemIterator, function(err, bidItems){
        async.map(bidItems, bidderIterator, function(err, bidders){
          auction.itemsForBid = bidItems;
          auction.itemOwners = bidders;
          cb(auction);
        });
      });
    });
  });
};

module.exports = Auction;

//Private Functions
function itemIterator(itemId, cb){
  var itemsList;
  Item.findById(itemId, function(err, item){
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


