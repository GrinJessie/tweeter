"use strict";

const userHelper    = require("../lib/util/user-helper")

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

  //post, /tweets/:timestamp
  //loop through, find a tweet
  //obj.likes = []
  //if login user in [], if not,
  //[].length - 1, remove user from []
  //if login user not in []
  //[].length + 1, add user into []
  tweetsRoutes.post('/:timestamp', function(req, res){
    const dateCreated = Number(req.params.timestamp);
    DataHelpers.findTweets('created_at', dateCreated, (err, list) => {
            if (err) console.log('first query', err);
            const tweet = list[0];
            let match = false;
            for (let i = 0; i < tweet.likes.length; i++) {
              if (tweet.likes[i] === "testUser") {
                tweet.likes.splice(i, 1);
                match = true;
                //find match in db, update this item in db, send it to font-end
                DataHelpers.updateTweet('created_at', dateCreated, tweet.likes, (err) => {
                  // if (err) console.log('second query ', err);
                  DataHelpers.findTweets('created_at', dateCreated, (err, list) => {
                    const tweet = list[0];
                    res.json({'numLikes':tweet.likes.length});
                  });
                });
              }
            }


            if (!match) {
              tweet.likes.push('testUser');
              DataHelpers.updateTweet('created_at', dateCreated, tweet.likes, (err) => {
                if (err) console.log(list);
                DataHelpers.findTweets('created_at', dateCreated, (err, list) => {
                  const tweet = list[0];
                  res.json({'numLikes':tweet.likes.length});

                });
              });
            }

    });
  });



  return tweetsRoutes;

}
