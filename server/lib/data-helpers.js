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
      db.collection('tweets').find().toray((err, tweets) => {
        callback(err, tweets.sort(sortNewestFirst));
      });
    },

    findTweets: function(key, target, callback) {
      const query = {};
      query[key] = target;
      db.collection('tweets').find(query).toArray((err, list) => {
        callback(err, list);
      });
    },

    updateTweet: function(key, target, newvalue, callback) {
      const query = {};
      query[key] = target;
      console.log('new likes list ', newvalue);
      db.collection('tweets').updateOne(query, {$set: { likes: newvalue}}, (err, list) => {
        callback(list);
      });
    }

  };
};