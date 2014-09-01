/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'hippie-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('post /items/auction', function(done){
    it('should create a new auction', function(done){
      request(app)
      .post('/items/auction/')
      .set('cookie', cookie)
      .send('ownerId=000000000000000000000001&name=Tasty+Apple+Lip+Balm&tag=Other')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /auction/:auctionId', function(done){
    it('should take a logged in user to see their personal auctions', function(done){
      request(app)
      .get('/auction/a30000000000000000000000')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should take a logged in user to someones auction page', function(done){
      request(app)
      .get('/auction/a20000000000000000000000')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /auction/search', function(){
    it('should fetch the the search page', function(done){
      request(app)
      .get('/auction/search')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('post /auction/:auctionId/accept', function(){
    it('should accept a swap with another user', function(done){
      request(app)
      .get('/auction/a10000000000000000000000/accept')
      .set('cookie', cookie)
      .send('00000000000000000000002a')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

});
