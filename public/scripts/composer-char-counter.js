$().ready(function() {
  //DONT USE FAT ARROW, IT WILL CHANGE THE CONTEXT OF 'THIS'
  //.last()is the last child in the LIST (a set of matched items)
  //same with .first(), both selecting all the items matched
  $('.new-tweet textarea').on('keyup', function() {
    let length = $(this).val().length;
    if (length <= 140) {
      $('.new-tweet span').text(length).removeClass('overlimit');
    } else {
      let count = $(this).parent().children('span')[0];
      $(count).text(140 - length).addClass('overlimit');
    }
  });
  // CHANGE: trigger when the input lose focuse there is a CHANGE!

  //BLUR: triggered if the element lose focus with or without a CHANGE...

});
