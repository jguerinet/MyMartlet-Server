//The authentication module
var auth = require('../auth')('admin', 'appvelopers');
//Router instance
var router = require('express').Router();

//The v1 config data
var v1Config = require('../data/v1_config.json');
//The v1 places data
var v1Places = require('../data/v1_places.json');

//Base route is the v1 data
router.get('/', auth, function(req, res) {
    res.json(v1Config);
});

//Places route
router.get('/places', auth, function(req, res) {
    res.json(v1Places);
})

//Export the router
module.exports = router;
