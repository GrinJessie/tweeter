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
      created_at: Date.now()
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
    const dateCreated = req.params.timestamp;
    DataHelpers.findMatch(dateCreated, (err, results) => {
      if (err) console.log(err);
      let match = false;
      for (let i = 0; i < results.likes.length; i++) {
        if (results.likes[i] === "@rd") {
          results.likes.splice(i, 1);
          match = true;
          res.send(results.likes.length);
          break;
        }
      }
      if (!match) {
        results.likes.push('testUser');
        res.send(results.likes.length);
      }
    });
  });



  return tweetsRoutes;

}
