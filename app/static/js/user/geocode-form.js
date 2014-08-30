/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button#edit-profile-submit').click(getLocation);
  });

  function getLocation(e){
    e.preventDefault();

    var loc = $('#loc').val();
    geocode(loc, function(name, lat, lng){
      $('#loc').val(name);
      $('#lat').val(lat);
      $('#lng').val(lng);
      $('#edit-profile').submit();
      console.log(name, lat, lng);
    });
  }
})();


