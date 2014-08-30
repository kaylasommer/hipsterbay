/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'hipsterbay-test';

describe('User', function(){
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
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });
  describe('#save', function(){
    it('should save a user', function(done){
      var u = new User(),
          o = {alias:'batman', phone:'615-123-1123'};

      u.save(o, function(err, user){
        expect(user.alias).to.equal('batman');
        expect(user.phone).to.equal('615-123-1123');
        done();
      });
    });
  });
});
