/* global google */
(function(){
  'use strict';
  var map;
  $(document).ready(function(){
    initMap(36, -87, 7);
  });

  function initMap(lat, lng, zoom){
    var styles = [{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'water','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#C6E2FF'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'color':'#C5E3BF'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#D1D1B8'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
})();

