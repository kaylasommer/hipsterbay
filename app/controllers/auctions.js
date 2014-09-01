'use strict';

var Auction = require('../models/auction'),
    Tag = require('../models/tag');

exports.new = function(req, res){
  Auction.create(req.body, function(){
    res.redirect('/items/manage');
  });
};

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

exports.acceptSwap = function(req, res){
  req.body.auctioneerId = res.locals.user._id;
  req.body.auctionId = req.params.auctionId;
  console.log('----REQ BODY----');
  console.log(req.body);
  console.log('----REQ BODY END ----');
  Auction.acceptSwap(req.body, function(){
    res.redirect('/');//change to congrats page later
  });
};
