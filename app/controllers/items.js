'use strict';

var Item = require('../models/item'),
    Auction = require('../models/auction');


exports.index = function(req, res){
  //Find all available items from currently logged in user
  Item.findAvailable(res.locals.user._id, function(err, items){
    //Find all auctions by currently logged in user
    Auction.findByOwnerId(res.locals.user._id, function(err, auctions){
      //Render the page with the items
      res.render('items/new', {available: items, auctions: auctions});
    });
  });
};
