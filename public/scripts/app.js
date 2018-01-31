/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$().ready(function(){
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

  const createTweetElement = function(obj){
      let $tweet = $('<article>').addClass('tweet');
      let name = obj.user.name
      let imgUrl = obj.user.avatars.small
      let handle = obj.handle
      let content = obj.content.text;
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

  renderTweets(data);
});