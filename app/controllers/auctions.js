'use strict';

var Auction = require('../models/auction'),
        Tag = require('../models/tag'),
       Item = require('../models/item');

exports.new = function(req, res){
  Auction.create(req.body, function(){
    res.redirect('/items/manage');
  });
};

exports.show = function(req, res){
  Auction.displayAuction(req.params.auctionId, function(auction){
    if(res.locals.user._id.toString() === auction.ownerId.toString()){
      res.render('auctions/seller-show', {auction:auction});
    }else{
      Item.findAvailable(res.locals.user._id, function(err, items){
        res.render('auctions/bidder-show', {auction:auction, items: items});
      });
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
      res.render('auctions/search', {tags:tags, auctions:auctions, user:res.locals.user});
    });
  });
};

exports.acceptSwap = function(req, res){
  req.body.auctioneerId = res.locals.user._id;
  req.body.auctionId = req.params.auctionId;
  Auction.acceptSwap(req.body, function(){
    res.redirect('/auction/congrats');
  });
};

exports.congrats = function(req, res){
  res.render('auctions/congrats');
};

exports.bid = function(req, res){
  Auction.bid(req.body.itemId, req.params.auctionId, function(){
    res.redirect('/auction/' + req.params.auctionId);
  });
};
