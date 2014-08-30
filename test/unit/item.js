/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Item      = require('../../app/models/item'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'hippie-test';

describe('Item', function(){
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

  describe('constructor', function(){
    it('should create a new Item object', function(){
      var apple = new Item({
        ownerId: '000000000000000000000001',
        name: 'Apple',
        photo: 'apple_core.jpg',
        description: 'It is an apple to end all apples'
      });
      expect(apple).to.be.instanceof(Item);
      expect(apple.ownerId).to.equal('000000000000000000000001');
      expect(apple.name).to.equal('Apple');
      expect(apple.photo).to.equal('apple_core.jpg');
      expect(apple.description).to.include('It is an');
      expect(apple.isForOffer).to.be.false;
      expect(apple.isForBid).to.be.false;
      expect(apple.isAvailable).to.be.true;
    });
  });

  describe('.create', function(){
    it('should create a new Item and save to database', function(done){
      var candle = {
        ownerId: '000000000000000000000001',
        name: 'candle',
        photo: 'candle.jpg',
        description: 'Wow, just a candle. Really? Seriously?'
      };
      Item.create(candle, function(err, item){
        expect(item).to.be.ok;
        done();
      });
    });
  });

  describe('.findAvailable', function(){
    it('should find available items for a given user in the database', function(done){
      Item.findAvailable('000000000000000000000001', function(err, items){
        expect(items).to.have.length(2);
        done();
      });
    });
  });

});
