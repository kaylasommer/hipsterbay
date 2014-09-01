(function(){
  'use strict';

  $(document).ready(function(){
    $('#add-item').submit(addItem);
  });

  function addItem(e){
    var $form = $(e.target),
     data = $form.serialize(),
    type = $form.attr('method'),
    url = $form.attr('action');
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: 'json',
      success: function(data){
        //Append the new item to the available items list
        var $availableItems = $('#availableItems'),
        $newItem = $('<tr><td><a href="/items/' + data._id + '/show">' + data.name + '</a>');
        $availableItems.append($newItem);
        $newItem.hide().fadeIn(1000);
      }
    });

    //Reset the form
    this.reset();

    //Prevent default behavior
    e.preventDefault();
  }


})();
