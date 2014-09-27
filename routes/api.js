module.exports = function(app) {
	//TODO Add authentication

	//Express router to define all the routes
	var apiRouter = require("express").Router();

	//Mongoose news feed objects
	var NewsFeed = require("../models/news_feed");

	//Delcare the rout ehandler for the /api route
	apiRouter.get("/GetConfig",function(req,res) {
		//Make a config object
		var config = {};

		//Call the mongoose method to get the news feed obbjects from the db
		NewsFeed.getObjectsForMobile(function(err,newsFeedItems) {
			//If err then return 500
			if(err) {
				res.send(500);
			}
			//Otheriwse
			else {
				//Set the config.NewsFeed var to the returned objects
				config.NewsFeed = newsFeedItems;
				//Returns the config after converting it to json
				res.json(config);
			}
		});
	});

	//Add the router to the app object
	app.use("/api",apiRouter);
};