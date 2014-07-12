var express = require('express');
var basicAuth = require('basic-auth');
var logfmt = require('logfmt');
var fs = require('fs');
var app = express();

//Logging
app.use(logfmt.requestLogger());

var username = 'admin';
var password = 'appvelopers';

//Read the config and places data from the JSON files
var configData = JSON.parse(fs.readFileSync('data/config.json', 'UTF8'));
var placesData = JSON.parse(fs.readFileSync('data/places.json', 'UTF8'));

var auth = function (req, res, next) {
    //User did not get authorized
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }

    var user = basicAuth(req);
    //Check that there is a user, a username, and a password
    if (!user || !user.name || !user.pass) {
        //If not, unauthorize them
        return unauthorized(res);
    }

    //Check that the correct username and password have been given
    if (user.name === username && user.pass === password) {
        return next();
    } 
    //If not, unauthorize them
    else {
        return unauthorized(res);
    }
};

//Root: Send them the config data
app.get('/',auth, function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(configData));
});

//Places: Send them the list of places
app.get('/places',auth, function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(placesData));  
});

//Start up on port 5000 locally, or the process port if on Heroku
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});