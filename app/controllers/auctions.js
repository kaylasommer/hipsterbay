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
    var query = req.query.tag ? {tag: req.query.tag} : {};
    Auction.filterTags(query, function(err, auctions){
      res.render('auctions/search', {tags:tags, auctions:auctions});
    });
  });
};
