var fs = require("fs");

var configData = JSON.parse(fs.readFileSync('data/config.json', 'UTF8'));
var placesData = JSON.parse(fs.readFileSync('data/places.json', 'UTF8'));

module.exports = function(app) {
	var configRouter = require("express").Router();

	configRouter.use(function(req,res,next) {
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
	});

	app.get('/', function(req, res) {
		res.set('Content-Type', 'application/json');
		res.json(configData);
	});

	app.get('/places',auth, function(req, res) {
		res.set('Content-Type', 'application/json');
		res.json(placesData);
	});
};