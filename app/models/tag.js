'use strict';
function Tag(){
}

Tag.findAll = function(cb){
  var tags = [
    'Art',
    'Books',
    'Electronics',
    'Food',
    'Furniture',
    'Household Items',
    'Men\'s Clothing',
    'Other',
    'Outdoor Tools',
    'Sporting Goods',
    'Toys',
    'Vehicles',
    'Women\'s Clothing'
  ];

  process.nextTick(function(){
    cb(tags);
  });
};

module.exports = Tag;
