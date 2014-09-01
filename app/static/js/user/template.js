(function(){
  'use strict';

  $(document).ready(function(){
    $('#search-form').submit(search);
  });

  function search(e){
    e.preventDefault();
    var query = $('#search').val();
    window.location = '/auction/search/' + query;
  }
})();

