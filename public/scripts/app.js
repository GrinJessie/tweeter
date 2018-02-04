/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$().ready(function(){

  //ensure plain text is show in browser
  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //display tweets from db in html
  //For like feature, include created-at info as identification and save in html data-*
  const createTweetElement = function(obj){
    let $tweet = $('<article>').addClass('tweet');
    let name = obj.user.name;
    let imgUrl = obj.user.avatars.small;
    let handle = obj.user.handle;
    let content = escape(obj.content.text);
    let days = Math.floor((Date.now() - obj['created_at']) / 86400000);
    let numLikes = obj.likes.length;
    let newTweet = [
      `<header><img src=${imgUrl}></img><h2>${name}</h2><span>${handle}</span></header>`,
      `<p>${content}</p><footer><p>${days} days ago</p>`,
      `<i class="fa fa-heart" aria-hidden="true" data-date-created="${obj['created_at']}"><span id='likes'>${numLikes}</span></i>`,
      '<i class="fa fa-retweet" aria-hidden="true"></i>',
      '<i class="fa fa-flag" aria-hidden="true"></i></footer>'
    ];
    $tweet.append(newTweet.join(''));
    return $tweet;
  };

  //create html for each tweet in db
  const renderTweets = function(array){
    for (let obj of array) {
      $('#tweet-container').append(createTweetElement(obj));
    }
  };

  //invoke loadTweets once DOM is ready
  $(function loadTweets (){
    $.ajax({
      url: '/tweets/',
      method: 'GET'
    }).done(function(data){
      renderTweets(data);
    });
  });

  //hide flash message once DOM is ready
  $(function hideFlashMessage (){
    $('#flash-message').hide();
  });

  //show flash message according to the content length of textarea when submit buttom is clicked
  $('#submitBtn').on('click', function(event) {
    event.preventDefault();
    //flash message to warn the empty content
    if (!$('#new-tweet-content').val()) {
      const errorMessage = 'Unfortunately! Cannot send empty tweet...';
      $('#flash-message').children('p').html(errorMessage);
      $('#flash-message').slideDown('slow');
    } else if ($('#new-tweet-content').val().length > 140) {
    //flash message to warn tweet more than 140 characters
      const errorMessage = 'Unfortunately! Cannot send tweet more than 140 characters...';
      $('#flash-message').children('p').html(errorMessage);
      $('#flash-message').slideDown('slow');
    } else {
      //hide flash message automatically if the tweet content is ideal
      //send new tweet to server for update in db
      //display new tweet on page
      //reset textarea
      $('#flash-message').hide('slow');
      const queryString = $('#new-tweet-content').serialize();
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: queryString
      }).done(function(newtweet){
        $newtweet = createTweetElement(newtweet);
        $('#tweet-container').prepend($newtweet);
        $('#new-tweet-content').val('');
      });
    }
  });

  //close flash message manually when user click close btn
  $('.fa-times').on('click', function(){
    $('#flash-message').slideUp('slow');
  });

  //toggle the tweet compose box when compose btn is clicked
  $('.composeBtn').on('click', function(){
    $('.new-tweet').slideToggle(function(){
      $('#new-tweet-content').focus();
    });
  });

  //feature: show likes, like and unlike a tweet
  //when like btn clicked, send identification info saved in html data-* to serve to find a match in db
  //display updated likes number in html along with like btn
  $('main').on('click', '.fa-heart', function(){
    const dateCreated = $(this).data('dateCreated');
    const likesCounter = $($(this).children('span'));
    $.ajax({
      url: `/tweets/${dateCreated}`,
      method: 'PUT'
    }).done(function(likes){
      $(likesCounter).html(likes.numLikes);
    });
  });
});