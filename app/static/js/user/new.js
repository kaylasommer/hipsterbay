(function(){
  'use strict';
    //Dave Note: Couldn't make AJAX return the new _id of the item, moving on to next feature

    $(document).ready(function(){
      $('#add-item').submit(addItem);
    })
    function addItem(e){
      var $form = $(e.target),
           data = $form.serialize(),
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
    })
    e.preventDefault();
    }


})();
