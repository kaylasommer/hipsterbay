(function(){
  'use strict';

  $(document).ready(function(){
    var $radio = $('input[type="radio"]');
    $radio.on('focus', showSwapButton);
    $radio.on('blur', hideSwapButton);


      
  });

  function showSwapButton(){
    $(this).closest('.bid').find('button').fadeIn(500);
  }

  function hideSwapButton(){
    $(this).closest('.bid').find('button').fadeOut(500);
  }

})();
