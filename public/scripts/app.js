/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$().ready(function(){

  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const createTweetElement = function(obj){
      let $tweet = $('<article>').addClass('tweet');
      let name = obj.user.name
      let imgUrl = obj.user.avatars.small
      let handle = obj.handle
      let content = escape(obj.content.text);
      let days = Math.floor((Date.now() - obj['created_at']) / 86400000);
      let newTweet = [
        `<header><img src=${imgUrl}></img><h2>${name}</h2><span>${handle}</span></header>`,
        `<p>${content}</p><footer><p>${days} days ago</p>`,
        '<i class="fa fa-flag" aria-hidden="true"></i>',
        '<i class="fa fa-retweet" aria-hidden="true"></i>',
        '<i class="fa fa-heart" aria-hidden="true"></i></footer>'
        ];
      $tweet.append(newTweet.join(''));
      return $tweet;
  };

  const renderTweets = function(array){
    for (let obj of array) {
      $('#tweet-container').append(createTweetElement(obj));
    }
  };

  $(function loadTweets (){
    $.ajax({
      url: '/tweets/',
      method: 'GET'
    }).done(function(data){
      renderTweets(data);
    })
  });

//submission listener and handler with flash message
  $('.new-tweet form input').on('click', function(event) {
    event.preventDefault();
//cannot send empty tweet
    if (!$(this).prev('textarea').val()) {
      const errorMessage = [
        '<div class="flash-message">',
        '<p>Unfortunately! Cannot send empty tweet...</p>',
        '<button><i class="fa fa-times" aria-hidden="true"></i></button></div>'
      ];
      $('.container').prepend(errorMessage.join('')).hide().fadeIn(500);
    } else if ($(this).prev('textarea').val().length > 140) {
//cannot send tweet more than 140 characters
      const errorMessage = [
        '<div class="flash-message">',
        '<p>Unfortunately! Cannot send tweet more than 140 characters...</p>',
        '<button><i class="fa fa-times" aria-hidden="true"></i></button></div>'
      ];
      $('.container').prepend(errorMessage.join(''));
    } else {
      $('.flash-message').remove();
      const queryString = $(this).prev('textarea').serialize();
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: queryString
        }).done(function(newtweet){
          $newtweet = createTweetElement(newtweet);
          $('#tweet-container').prepend($newtweet);
        });
    };
  });

//close flash message listener
  $('main').on('click', '.fa-times', function(){
    $($(this).parent()).fadeOut(500, function(){
      $($(this).parent()).remove();
    });
  });

//compose handler
  $('.composeBtn').on('click', function(){
    $('.new-tweet').slideToggle(function(){
      $('.new-tweet').children('form').children('textarea').focus();
    });
  });

});