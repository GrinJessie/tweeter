"use strict";

const userHelper    = require("../lib/util/user-helper");
const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: []
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    });
  });

  //feature: route listening for updating likes list
  tweetsRoutes.put('/:timestamp', function(req, res){
    //use created date as identification info to query the match in db
    const dateCreated = Number(req.params.timestamp);
    const query = {};
    query['created_at'] = dateCreated;
    DataHelpers.findTweets(query, (err, list) => {
      if (err) {
        console.log('first query err ', err);
      }
      const tweet = list[0];
      //set and change match variable in the loop of finding match
      //used to perform different action
      let match = false;
      for (let i = 0; i < tweet.likes.length; i++) {
        if (tweet.likes[i] === "testUser") {
          //if find matched user in likes list
          //remove this like from list
          //find and update new likes list in db
          //send response with the number of likes in the list
          tweet.likes.splice(i, 1);
          match = true;
          DataHelpers.updateTweet(query, tweet.likes, (err) => {
            if (err) {
              console.log('second query err ', err);
            }
            DataHelpers.findTweets(query, (err, list) => {
              const tweet = list[0];
              res.json({ 'numLikes': tweet.likes.length});
            });
          });
        }
      }
      //if no match found in the loop
      //push this like to list
      //find and update new likes list in db
      //send response with the number of likes in the list
      if (!match) {
        tweet.likes.push('testUser');
        DataHelpers.updateTweet(query, tweet.likes, (err) => {
          if (err) {
            console.log(err);
          }
          DataHelpers.findTweets(query, (err, list) => {
            const tweet = list[0];
            res.json({ 'numLikes': tweet.likes.length});
          });
        });
      }
    });
  });



  return tweetsRoutes;

};
