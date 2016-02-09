var configV1 = require('../data/config_v1.json');

var configData = require('../data/config.json');
var placesData = require('../data/places.json');

module.exports = function(app) {
	//Route to get the config for the mobile devices
	require("./v1")(app);

	function auth(req, res, next) {
		//Basic auth module
		var basicAuth = require("basic-auth");

		function unauthorized(res) {
			res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
			res.status(401).end();
		}

		//Get the user info from the request
		var user = basicAuth(req);

		//Username and password variables 
		var username = 'kjw3ro3ijro4wirj';
		var password = 'p4j2340rf9rifkerv';

		//Check that there is a user, username, and password and that they match
		if (!user || !user.name || !user.pass || user.name !== username ||
            user.pass !== password) {
			//If not, unauthorize them
			unauthorized(res);
		} else {
			return next();
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
