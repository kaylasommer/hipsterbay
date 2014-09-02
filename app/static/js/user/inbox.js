(function(){
  'use strict';

  $(document).ready(function(){
    getNotifications();
  });

  function getNotifications(){
    $.getJSON('/messages/unread', function(data){
      if (data.length > 0) {
        $('.notification').text(data.length);
      }
    });
  }

})();
