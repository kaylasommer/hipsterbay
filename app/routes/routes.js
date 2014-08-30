'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/', home.index);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  app.use(security.bounce);
  app.delete('/logout', users.logout);
  app.get('/user/profile', users.profile);
  //app.post('/user/profile', users.editProfile);
  //app.get('/items/manage', items.index);
  //app.post('/items/add', items.addItem);
  //app.get('/items/show', items.show);
  //app.delete('/items/:itemId', items.delete);
  //app.post('/items/auction', auctions.new);
  //app.get('/auction/:auctionId', auctions.show);
  //app.post('/auction/:auctionId/accept', auctions.acceptSwap);
  //app.get('/auction/search', auctions.search);
  //app.post('/auction/:auctionId/bid', auctions.bid);
  //app.post('/message/:ownerId', users.send);
  //app.post('/message/reply', users.reply);

  console.log('Express: Routes Loaded');
};

