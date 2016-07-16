// The authentication module
var auth = require('../auth')('admin', 'appvelopers');
// Router instance
var router = require('express').Router();

// The v1 config data
var config = require('../data/v1/config.json');
// The v1 places data
var places = require('../data/v1/places.json');

// Base route is the v1 data
router.get('/config', auth, function(req, res) {
    res.json(config);
});

// Places route
router.get('/places', auth, function(req, res) {
    res.json(places);
})

// Export the router
module.exports = router;
