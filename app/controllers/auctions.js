'use strict';

var Auction = require('../models/auction'),
    Tag = require('../models/tag');

exports.show = function(req, res){
  Auction.displayAuction(req.params.auctionId, function(auction){
    console.log(auction);
    if(res.locals.user._id.toString() === auction.ownerId.toString()){
      res.render('auctions/seller-show', {auction:auction});
    }else{
      res.render('auctions/bidder-show', {auction:auction});
    }
  });
};

exports.search = function(req, res){
  Tag.findAll(function(tags){
    var filter = req.query.tag ? {tag: req.query.tag} : {};

    Auction.findAll(filter, function(err, auctions){
      if(req.params.query){
        auctions = Auction.filterBySearchQuery(auctions, req.params.query);
      }
      res.render('auctions/search', {tags:tags, auctions:auctions});
    });
  });
};
