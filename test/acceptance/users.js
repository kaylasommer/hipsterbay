/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'template-test';

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

  describe('get /login', function(){
    it('should show the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('post /register', function(){
    it('should register and login a user and redirect', function(done){
      request(app)
      .post('/register')
      .send('email=abcde%40aol.com&password=abcd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/user/profile');
        done();
      });
    });
  });

  describe('post /login', function(){
    it('should login a user and redirect', function(done){
      request(app)
      .post('/login')
      .send('email=bob%40aol.com&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/user/profile');
        done();
      });
    });
  });

  describe('get /user/profile', function(){
    it('should not go to the page when user isnt logged in', function(done){
      request(app)
      .get('/user/profile')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });

});

