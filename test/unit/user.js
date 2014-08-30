/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'hippie-test';

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
      var o = {
        email : 'sue@aol.com',
        password : 'abcd',
        alias : 'Sue',
        phone : '+15005550006',
        photo : 'http://votesmart.org/canphoto/2541_lg.jp://pbs.twimg.com/profile_images/3485378075/96bb6b9c4cb37faf3e41b7e42f0a372b.jpeg',
        loc : {
          name : 'Nashville',
          lat : 36.1866405,
          lng : -86.7852455
        }
      },
      u = new User(o);
      expect(u).to.be.instanceof(User);
    });
  });

  describe('#update', function(){
    it('should update an item', function(done){
      User.findById('000000000000000000000002', function(user){
        user.update(user, function(){
          expect(user.alias).to.equal('Sue');
          expect(user.phone).to.equal('+15005550006');
          done();
        });
      });
    });
  });
});
