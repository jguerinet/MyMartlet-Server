// Router instance
var router = require('express').Router();

// Config data
var config = require('../data/v2/config.json');
// Places data
var places = require('../data/v3/places.json');
// Categories data
var categories = require('../data/v2/categories.json');
// Registration Terms data
var registrationTerms = require('../data/v2/registration_terms.json');

// Last date the config was modified
var modifiedConfig = new Date('2016-03-01');
// Last date the places were modified
var modifiedPlaces = new Date('2016-03-01');
// Last date the categories were modified
var modifiedCategories = new Date('2016-03-01');
// Last date the registration terms were modified
var modifiedRegistrationTerms = new Date('2016-07-16');

// Base route redirects to the config
router.get('/', function(req, res) {
	res.redirect('/config')
});

// Config route
router.get('/config', function(req, res) {
	parseRequest(req, res, modifiedConfig, config);
});

// Places route
router.get('/places', function(req, res) {
	parseRequest(req, res, modifiedPlaces, places);
});

// Categories route
router.get('/categories', function(req, res) {
	parseRequest(req, res, modifiedCategories, categories);
});

// Registration Terms route
router.get('/registration-terms', function(req, res) {
	parseRequest(req, res, modifiedRegistrationTerms, registrationTerms);
})

// Parses the request and returns the right info based on the If-Modified-Since
var parseRequest = function(req, res, ifModifiedSinceDate, json) {
	// Parse the passed If-Modified-Since date
	var ifModifiedSince = new Date(req.headers['if-modified-since']);
	if (ifModifiedSince && ifModifiedSince > ifModifiedSinceDate) {
		// There is an If-Modified-Since and it's after the last time the
		//	data was updated -> send a 503
		res.status(304).end();
	} else {
		res.json(json);
	}
}

// Export the router
module.exports = router;
