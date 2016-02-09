//This is the framework we will use to make out lives a whole lot easier
var express = require('express');

//The nodejs path module to make paths that are cross platform
var path = require('path');

//Make the default app object without any routes and middlewares added
var app = express();

//Our logging module
var logger = require('morgan');
app.use(logger('dev'));

//Module to pars the body of the request for post messages
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set the folder which has all our static files so that express can handle serving them
app.use(express.static(path.join(__dirname, 'public')));
//Add all the routes for our application
require("./routes")(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
