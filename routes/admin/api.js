module.exports = function(adminRouter) {
	//Get the userRoles which has the methods we need to check authorization
	var userRoles = require("../../config/connect_roles");

	//Get the mongoose NewsFeed model object used to save and reteive news feed objects
	var NewsFeed = require("../../models/news_feed");

	//The route handler to save a NewsFeed object to the db
	adminRouter.post("/api/save_news_feed", userRoles.can("edit"), function(req,res) {
		//The count of how many items have been saved to the db
		var numNewsFeedItemsSuccessSaved = 0;
		//The count of how many items have been tries to save to the db
		var numNewsFeedItemsTrySaved = 0;

		//Go throguh the items passed in the request body
		for(var index=0; index<req.body.newsFeedItems.length; index++) {
			//Call the method to save a object to newfeed collection
			NewsFeed.saveNewsFeedItem(req.body.newsFeedItems[index],req.user.Email,function(err) {
				//If no err in saving then increment the count of number of items saved
				if(!err) {
					numNewsFeedItemsSuccessSaved++;
				}

				//Increment the count of the number of tiems tries to save
				numNewsFeedItemsTrySaved++;

				//This checks if we tries to save all the items passed in the request. If we have go inside the if loop
				if(numNewsFeedItemsTrySaved === req.body.newsFeedItems.length) {
					//This checks if all the items have been sucessfully saved. If it is true then send 200
					if(numNewsFeedItemsSuccessSaved === numNewsFeedItemsTrySaved) {
						res.status(200).end();
					}
					//Otheriwse send 500
					else {
						res.status(500).end();
					}
				}
			});
		}
	});

	//The route handler to get config object for the admin system
	adminRouter.get("/api/GetConfig",userRoles.can("view"),function(req,res) {
		//the config object
		var config = {};

		//Get the news feed object from the db
		NewsFeed.getObjectsForAdmin(function(err,newsFeedItems) {
			//if err return 500
			if(err) {
				res.status(500).end();
			}
			//Otherwise
			else {
				//Set the NewsFeed feild to the array of news feed object
				config.NewsFeed = newsFeedItems;

				//Jsonify the config object and return it to the client
				res.json(config);
			}
		});
	});
};