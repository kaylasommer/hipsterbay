/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Message   = require('../../app/models/message'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'hippie-test';

describe('Message', function(){
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

  describe('.findByReceiverId', function(){
    it('should find all messages received by the receiver', function(done){
      Message.findByReceiverId('000000000000000000000002', function(err, messages){
        expect(messages).to.have.length(2);
        done();
      });
    });
  });

  describe('#save', function(){
    it('should save the message', function(done){
      var message = new Message();
      message.isRead = true;
      message.save(function(err, savedMessage){
        expect(savedMessage.isRead).to.be.true;
        expect(savedMessage._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a message by its id', function(done){
      var id = 'aa0000000000000000000002';
      Message.findById(id, function(message){
        expect(message.message).to.include('I am not sure, let me think about it.');
        done();
      });
    });
  });
});
