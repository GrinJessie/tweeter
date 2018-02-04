$().ready(function() {
  //ARROW function will change the CONTEXT OF 'THIS'...
  //.last() and .first() is the last child in the LIST (a set of matched items)
  // CHANGE: trigger when the input lose focuse there is a CHANGE!
  //BLUR: triggered if the element lose focus with or without a CHANGE...


  //update counter for each KEYUP event according to the content length in the textarea
  $('.new-tweet textarea').on('keyup', function() {
    let length = $(this).val().length;
    if (length <= 140) {
      $('.new-tweet span').text(140 - length).removeClass('overlimit');
    } else {
      $('.new-tweet span').text(140 - length).addClass('overlimit');
    }
  });


});
