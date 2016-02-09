//The v1 data
var v1 = require('../data/config_v1.json');
//The authentication module
var auth = require('../auth')('admin', 'appvelopers');
//Router instance
var router = require('express').Router();

//Base route is the v1 data
router.get('/', auth, function(req, res) {
  res.json(v1);
});

//Export the router
module.exports = router;
