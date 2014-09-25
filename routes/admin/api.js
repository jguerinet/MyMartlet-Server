module.exports = function(adminRouter) {
	//Get the userRoles which has the methods we need to check authorization
	var userRoles = require("../../config/connect_roles");

	//Get the mongoose NewsFeed model object used to save and reteive news feed objects
	var NewsFeed = require("../../models/news_feed");

	//The route handler to save a NewsFeed object to the db
	adminRouter.post("/api/save_news_feed", userRoles.can("edit"), function(req,res) {
		//Call the method to save a object to newfeed collection
		NewsFeed.saveNewsFeedItem(req.body,req.user.Email,function(err) {
			//If err send 500
			if(err) {
				res.status(500).end();
			}
			//Otherwise all good send 200
			else {
				res.status(200).end();
			}
		});
	});
};