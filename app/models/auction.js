'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    User  = require('./user'),
    _     = require('lodash'),
    Item  = require('./item');

function Auction(o){
  this.name          = o.name;
  this.bids          = [];
  this.offeredItemId = Mongo.ObjectID(o.offeredItemId);
  this.ownerId       = Mongo.ObjectID(o.ownerId);
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
console.log(auction, o.offeredItemId);
  Item.collection.update({_id: auction.offeredItemId}, {$set: {isForOffer: true, isAvailable: false}}, function(){
    Auction.collection.save(auction, cb);
  });
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
      }, function(err, auctions){
        async.map(auctions,
          function(auction, cb){
            User.findById(auction.ownerId, function(user){
              auction.user = user;
              cb(null, auction);
            });
          }, function(err, auctions){
            cb(err, auctions);
          });
      });
  });
};

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

