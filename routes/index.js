var configData = require('../data/config.json');
var placesData = require('../data/places.json');

module.exports = function(app) {
	function auth(req,res,next) {
		var basicAuth = require("basic-auth");

		function unauthorized(res) {
			res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
			res.status(401).end();
		}

		var user = basicAuth(req);

		var username = 'admin';
		var password = 'appvelopers';

		//Check that there is a user, a username, and a password
		if (!user || !user.name || !user.pass) {
			//If not, unauthorize them
			unauthorized(res);
		}
		//Check that the correct username and password have been given
		else if (user.name === username && user.pass === password) {
			return next();
		}
		//If not, unauthorize them
		else {
			unauthorized(res);
		}
	}

	var configRouter = require("express").Router();
	configRouter.use(auth);
	configRouter.get('/', function(req, res) {
		res.json(configData);
	});

	var placesRouter = require("express").Router();
	placesRouter.use(auth);
	placesRouter.get('/', function(req, res) {
		res.json(placesData);
	});

	app.use("/config",configRouter);
	app.use("/places",placesRouter);

    app.get("/",function(req,res) {
        res.redirect("/api/config");
    });
};
