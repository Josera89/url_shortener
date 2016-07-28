var express = require("express");
var PORT = process.env.PORT || 8080; // default port 8080

var app = express();
app.set("view engine", "ejs");


//METHOD OVERRIDE
var connect        = require('connect');
var methodOverride = require('method-override');
app.use(methodOverride('_method'))

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



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
  urls = Object
    .keys(urlDatabase)
    .map(function(short){
      return { long:urlDatabase[short],
                short }
  })
  res.render("pages/urls_index", urls);
});

app.get("/urls", (req, res) => {
  res.redirect("/");
});



app.post("/urls/create", (req, res) => {
  var shortURL = randomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(req.body);
  res.redirect("/urls/");
});

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.get("/urls/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});