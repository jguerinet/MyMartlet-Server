var configV1 = require('../data/config_v1.json');

module.exports = function(app) {
	function auth(req,res,next) {
		var basicAuth = require("basic-auth");

		function unauthorized(res) {
			res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
			res.status(401).end();
		}

        //Get the basic auth info
		var user = basicAuth(req);

        //Basic auth username and password
		var username = 'admin';
		var password = 'appvelopers';

		//Check that there is a user, username, and password and that they match
		if (!user || !user.name || !user.pass || user.name !== username ||
            user.pass !== password) {
			//If not, unauthorize them
			unauthorized(res);
		} else {
			return next();
		}
	}

    //Set up the config router
	var configRouter = require("express").Router();
	configRouter.use(auth);
	configRouter.get('/', function(req, res) {
		res.json(configV1);
	});

    //Set up the v1 config at the /config endpoint 
	app.use("/config", configRouter);
};
