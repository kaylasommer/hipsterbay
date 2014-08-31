'use strict';

var Auction = require('../models/auction');

exports.new = function(req, res){
  console.log(req.body);
  Auction.create(req.body, function(){
    res.redirect('/items/auctionId');
  });
};
