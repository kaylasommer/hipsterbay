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

  describe('get /items/manage', function(){
    it('should show the item management page where users can create new items', function(done){
      request(app)
      .get('/items/manage')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('post /items/add', function(){
    it('should create a new available item', function(done){
      request(app)
      .post('/items/add')
      .set('cookie', cookie)
      .send('name=Test+Item&ownerId=000000000000000000000002&photo=test.jpg&description=Testing+description')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

});
