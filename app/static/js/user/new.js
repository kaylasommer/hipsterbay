(function(){
  'use strict';
    $(document).ready(function(){
      $('#form').submit(addItem);
    });

    function addItem(e){
    var $form = $('#form'),
        data = $form.serialize,
        type = $form.attr('method'),
        url = $form.attr('action');

    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: 'html',
      success: function(data){
        console.log(data);
      }
    });

    e.preventDefault();

    }


})();