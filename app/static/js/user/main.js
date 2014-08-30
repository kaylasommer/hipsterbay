/* jshint unused:false, camelcase:false */
/* global google */
/* these are global functions*/

function geocode(address, cb){
  'use strict';
  console.log('geocode ' + address);
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, function(results, status){
    var name = results[0].formatted_address,
    lat  = results[0].geometry.location.lat(),
    lng  = results[0].geometry.location.lng();
    cb(name, lat, lng);
  });
}


function addMarker(map, lat, lng, name){
  'use strict';
  var latLng = new google.maps.LatLng(lat, lng);
  new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP});

}

