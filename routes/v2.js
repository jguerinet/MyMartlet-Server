//The authentication module
var auth = require('../auth')('kjw3ro3ijro4wirj', 'p4j2340rf9rifkerv');
//Router instance
var router = require('express').Router();

//Config data
var config = require('../data/config.json');
//Places data
var places = require('../data/places.json');
//Categories data
var categories = require('../data/categories.json');

//Last date the config was modified
var modifiedConfig = new Date('2016-02-08');
//Last date the places were modified
var modifiedPlaces = new Date('2016-02-08');
//Last date the categories were modified
var modifiedCategories = new Date('2016-02-08');

//Base route redirects to the config
router.get('/', function(req, res) {
	res.redirect('/config')
});

//Config route
router.get('/config', auth, function(req, res) {
	parseRequest(req, res, modifiedConfig, config);
});

//Places route
router.get('/places', auth, function(req, res) {
	parseRequest(req, res, modifiedPlaces, places);
});

//Categories route
router.get('/categories', auth, function(req, res) {
	parseRequest(req, res, modifiedCategories, categories);
});

//Parses the request and returns the right info based on the If-Modified-Since
var parseRequest = function(req, res, ifModifiedSinceDate, json) {
	//Parse the passed If-Modified-Since date
	var ifModifiedSince = new Date(req.headers['if-modified-since']);
	if (ifModifiedSince && ifModifiedSince > ifModifiedSinceDate) {
		//There is an If-Modified-Since and it's after the last time the
		//	data was updated -> send a 503
		res.status(304).end();
	} else {
		res.json(json);
	}
}

//Export the router
module.exports = router;
