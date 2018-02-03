"use strict";

const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb://localhost:27017/tweeter';

module.exports = MongoClient.connect(MONGODB_URI, (err, db) => {
  return db;
});


