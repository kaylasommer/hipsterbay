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

  describe('get /items/show', function(){
    it('should show a specific item  page', function(done){
      request(app)
      .get('/items/00000000000000000000000a/show')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Candle');
        done();
      });
    });
  });
  describe('delete /items/:itemId', function(done){
    it('should delete an item', function(done){
      request(app)
      .delete('/items/00000000000000000000000a')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});
