'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    User  = require('./user'),
    _     = require('lodash'),
    Item  = require('./item'),
    User  = require('./user'),
  Mailgun = require('mailgun-js');

function Auction(o){
  this.name          = o.name || 'Untitled Auction';
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

Auction.acceptSwap = function(swap, cb){
  var keys = Object.keys(swap);

  //Change objects to Mongo objects
  keys.forEach(function(key){
    swap[key] = Mongo.ObjectID(swap[key]);
  });

  //Update item ownership status for seller and send him/her a text and email
  Item.collection.findAndModify({_id: swap.auctionItem}, {}, {$set: {ownerId: swap.bidderId, isForOffer: false, isAvailable: true}}, function(err1, aucItem){
    Item.collection.findAndModify({_id: swap.bidderItem}, {}, {$set: {ownerId: swap.auctioneerId, isForBid: false, isAvailable: true}}, function(err2, bidderItem){
      Auction.collection.remove({_id: swap.auctionId}, function(){
        User.findById(bidderItem.ownerId, function(winner){
          winnerTextMsg(winner.phone, aucItem, function(err, response){
            winnerEmail(winner.email, aucItem, function(err, response){
              cb(bidderItem, aucItem);
            });
          });
        });
      });
    });
  });

};

Auction.bid = function(item, auction, cb){
  item = Mongo.ObjectID(item);
  auction = Mongo.ObjectID(auction);
  var bid = item.toString();
  Item.collection.update({_id: item}, {$set: {isAvailable: false, isForBid: true}}, function(err1, item){
    Auction.collection.update({_id: auction}, {$push: {bids: bid}}, function(err2, auction){
      cb(item, auction);
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
  User.findById(bidder.ownerId, function(owner){
    itemOwners = owner;
    cb(null, itemOwners);
  });
}

function winnerTextMsg(to, item, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = require('twilio')(accountSid, authToken),
      body       = 'Your bid for: ' + item.name  + ' has been chosen!';

  client.messages.create({to:to, from:from, body:body}, cb);
}

function winnerEmail(to, item, cb){
  var apikey = process.env.GUNKEY,
      domain = process.env.GUN_DOMAIN,
     mailgun = new Mailgun({apiKey: apikey, domain: domain}),
        body = 'Your bid for: ' + item.name  + ' has been chosen! Make needed arrangements for the trade.',
        data = {from: 'admin-no-reply@hipsterbay.com', to: to, subject: 'Your bid has been chosen for ' + item.name, text: body};

  mailgun.messages().send(data, cb);

}
