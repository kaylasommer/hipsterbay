'use strict';

var Item = require('../models/item'),
    Tag  = require('../models/tag');

exports.show = function(req, res){
  Tag.findAll(function(tags){
    Item.findById(req.params.itemId, function(err, item){
      res.render('items/edit', {item : item, tags:tags});
    });
  });
};

exports.delete = function(req, res){
  Item.deleteById(req.params.itemId, function(){
    res.redirect('/items/manage');
  });
};
