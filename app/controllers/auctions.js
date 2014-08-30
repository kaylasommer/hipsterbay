'use strict';

var Auction = require('../models/auction');

exports.show = function(req, res){
    console.log(res.locals.user._id, req.params.auctionId);

  Auction.displayAuction(req.params.auctionId, function(auction){
    console.log(res.locals.user._id, auction.ownerId);
    if(res.locals.user._id === auction.ownerId){
      console.log('Personal Page');
      console.log(auction);
      res.render('auctions/seller-show', {auction:auction});
    }else{
      //console.log('Other Persons Page');
      //console.log(auction);
      res.render('auctions/bidder-show', {auction:auction});
    }
  });
};
