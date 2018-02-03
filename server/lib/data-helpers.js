"use strict";


module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet, (err) => {
        callback(err);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (b, a) => a.created_at - b.created_at;
      db.collection('tweets').find().sort({created_At: 1}).toArray((err, tweets) => {
        callback(err, tweets.sort(sortNewestFirst));
      });
    }

    findMatch: function(target) {
      db.collection('tweets').find({created_at: target}).toArray((err, tweets) => {
        callback(err, tweets);
      });
    }


}
