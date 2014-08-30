'use strict';



function Item(o){
  this.name        = o.name;
  this.ownerId     = o.ownerId;
  this.description = o.description;
  this.photo       = o.photo;

  //private properties
  this.isForOffer  = false;
  this.isForBig    = false;
  this.isAvailable = true;
}


module.exports = Item;
