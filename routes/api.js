//Config data
var config = require('../data/config.json');
//Places data
var places = require('../data/places.json');
//Categories data
var categories = require('../data/categories.json');
//The authentication module
var auth = require('../auth')('kjw3ro3ijro4wirj', 'p4j2340rf9rifkerv');
//Router instance
var router = require('express').Router();

//Base route redirects to the config
router.get('/', function(req, res) {
	res.redirect('/config')
});

//Config route
router.get('/config', auth, function(req, res) {
	res.json(config);
});

//Places route
router.get('/places', auth, function(req, res) {
	res.json(places);
});

//Categories route
router.get('/categories', auth, function(req, res) {
	res.json(categories);
});

//Export the router
module.exports = router;
