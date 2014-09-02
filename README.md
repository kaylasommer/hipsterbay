## Hipsterbay
### Code Badges
[![Build Status](https://travis-ci.org/kaylalynjones/hipsterbay.svg)](https://travis-ci.org/kaylalynjones/hipsterbay)
[![Coverage Status](https://coveralls.io/repos/kaylalynjones/hipsterbay/badge.png)](https://coveralls.io/r/kaylalynjones/hipsterbay)

### Screenshots
- Coming soon

### Description
### A modern bartering application built on NodeJS. Users can register accounts and search for auctions that are nearby or far away. Tired of that nasty rug from the 80s? Trade it in for a new used tire.Can't stand your roommates cat? Trade it for a ferret named Cthulhu. Is that old worn-out shoe losing it's new-factor? Plenty of new old-worn out shoes to trade! This is Hipsterbay.

## Polar bears hate us.

## Hipsters love us.

## Models

#User
- prop-alias
- prop-email
- prop-password
- prop-phone
- prop-photo
- prop-loc
- .findById
- .register
- .authenticate
- .update
- .unread
- .send

```
#Item
- prop-name
- prop-ownderId
- prop-description
- prop-photo
- prop-isForOffer
- prop-isForBid
- prop-isAvailable
- .create
- .findAvailable
- .findById
- .findByOwnerId
- .deleteById


```
#Message
- prop-senderId
- prop-receiverId
- prop-message
- prop-date
- prop-isRead
- .findByReceiverId
- .save
- .unread
- .send
- fn-iterator

```
#Tag
- .findAll

```
#Auction
- prop-name
- prop-bids
- prop-offeredItemId
- prop-ownderId
- prop-tag
- .findByOwnerId
- .create
- .filterBySearchQuery
- .findAll
- .displayAuction
- .acceptSwap
- .bid
- fn-itemIterator
- fn-bidderIterator
- fn-winnerTextMsg
- fn-winnerEmail

### Database
```
auctions
```

```
items
```

```
messages
```

```
users
```

### Features
- Login/Logout
- String Search
- Geolocation
- Google Maps API
- Internal Messaging
- jQuery
- NodeJS

### Running Tests
```bash
$ npm install
$ npm test
```

### Contributors
- Shruti Sharma
- Dave Boling
- Dennis Stanley

### License
[MIT](LICENSE)

