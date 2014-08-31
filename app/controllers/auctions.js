'use strict';

var Auction = require('../models/auction');

exports.show = function(req, res){
  Auction.displayAuction(req.params.auctionId, function(auction){
    if(res.locals.user._id.toString() === auction.ownerId.toString()){
      res.render('auctions/seller-show', {auction:auction});
    }else{
      res.render('auctions/bidder-show', {auction:auction});
    }
  });
};
