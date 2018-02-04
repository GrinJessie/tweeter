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
      db.collection('tweets').find().toArray((err, tweets) => {
        callback(err, tweets.sort(sortNewestFirst));
      });
    },

    // find matched tweet in db, perform action on it in callback
    findTweets: function(query, callback) {
      db.collection('tweets').find(query).toArray((err, list) => {
        callback(err, list);
      });
    },

    //update matched tweet in db, perform action on it in callback
    updateTweet: function(query, newvalue, callback) {
      db.collection('tweets').updateOne(query, {$set: { likes: newvalue}}, (err, list) => {
        callback(list);
      });
    }

  };
};