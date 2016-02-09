//This is the framework we will use to make out lives a whole lot easier
var express = require('express');

//The nodejs path module to make paths that are cross platform
var path = require('path');

//Make the default app object without any routes and middlewares added
var app = express();

//Our logging module
var logger = require('morgan');
app.use(logger('dev'));

//Set the view engine
app.set('view engine', 'jade');

//Module to pars the body of the request for post messages
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set up the v1 endpoint
app.use('/config', require('./routes/v1'));

//Set up the api endpoint
app.use('/api', require('./routes/api'));

//Redirect the base to the config
app.get('/', function(req, res) {
	res.redirect('/api/config')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* Error Handlers */

//Development Error Handler: Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//Production Error Handler: No stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
