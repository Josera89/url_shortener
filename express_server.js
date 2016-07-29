"use strict";

var express = require("express");
var PORT = process.env.PORT || 8080; // default port 8080

var app = express();
app.set("view engine", "ejs");

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);
let dbInstance;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }
  dbInstance = db;
  console.log('Connected to the database!');
  let collection = db.collection("urls");
  console.log('Retreiving documents for the collection...');
  collection.find().toArray((err, results) => {
    console.log('results found', results);
  });
});

var connect        = require('connect');
var methodOverride = require('method-override');
app.use(methodOverride('_method'))

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

function randomString() {
  const chars =  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = 6;
  var result = '';
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
    return result;
}

app.get("/", (req, res) => {
  dbInstance.collection("urls").find().toArray(function(err, results) {
    console.log(results);
    res.render("pages/urls_index", { urls: results });
  });
});

app.get("/urls", (req, res) => {
  res.redirect("/");
});

app.post("/urls/create", (req, res) => {
  var shortURL = randomString();

  dbInstance.collection("urls").insert(
    {
      shortURL: shortURL,
      longURL: req.body.longURL,
    }, function() {
      console.log('Done!')
    })

  console.log('Done inserting');
  console.log(req.body);
  res.redirect("/");
});

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.get("/urls/:id", (req, res) => {
  dbInstance.collection("urls").findOne({shortURL: req.params.id}, function(err, urlDoc) {
    console.log(urlDoc);
    res.render("pages/urls_show", urlDoc);
  });
});

app.delete("/urls/:id", (req, res) => {
  dbInstance.collection("urls").deleteOne({shortURL: req.params.id}); // use callback
  res.redirect("/urls");
});

app.get("/urls/:id/edit", (req, res) => {
  dbInstance.collection("urls").find({shortURL: req.params.id}).toArray(function(err, results) {
    res.render("pages/urls_show", { url: results[0] });
  });
});

app.put("/urls/:id/", (req, res) => {
  dbInstance.collection("urls").updateOne({shortURL: req.params.id}, {$set: {longURL: req.body.longURL}}, function(err, urlDoc) {
      res.redirect("/urls");
  });
});

app.get("/urls.json", (req, res) => {
  dbInstance.collection("urls").find().toArray(function(err, results) {
    res.json(results);
  });
});


