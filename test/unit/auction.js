/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Auction   = require('../../app/models/auction'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'hippie-test';

describe('Auction', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.findByOwnerId', function(){
    it('should find all auctions for a specific user', function(done){
      Auction.findByOwnerId('000000000000000000000002', function(err, auctions){
        expect(auctions).to.have.length(2);
        done();
      });
    });
  });

  describe('.displayAuction', function(){
    it('should display an auction with items and the bidders of those items', function(done){
      Auction.displayAuction('a20000000000000000000000', function(auction){
        expect(auction.ownerId).to.be.instanceof(Mongo.ObjectID);
        expect(auction.bids).to.have.length(1);
        //expect(auction.bidders).to.have.length(1);
        done();
      });
    });
  });




});
