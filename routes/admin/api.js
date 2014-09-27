module.exports = function(adminRouter) {
	//Get the userRoles which has the methods we need to check authorization
	var userRoles = require("../../config/connect_roles");

	//Get the mongoose NewsFeed model object used to save and reteive news feed objects
	var NewsFeed = require("../../models/news_feed");

	//The route handler to save a NewsFeed object to the db
	adminRouter.post("/api/save_news_feed", userRoles.can("edit"), function(req,res) {
		//Call the NewsFeed static method to save the passed rray of newsFeedItems
		NewsFeed.saveNewsFeedItems(req.body.newsFeedItems,req.user.Email,function(newsFeedItemsSaved) {
			//If the returned array has a null value then some of the item were not saved so send 500
			if(newsFeedItemsSaved.indexOf(null) > -1) {
				res.status(500).end();
			}
			//Otherwise send the items back
			else {
				res.json(newsFeedItemsSaved);
			}
		});
	});

	//The route handler to deletes a NewsFeed object to the db
	adminRouter.post("/api/delete_news_feed", userRoles.can("edit"), function(req,res) {
		//The count of how many items have been removed from the db
		var numNewsFeedItemsSuccessDelete = 0;
		//The count of how many items have been tried to removed from the db
		var numNewsFeedItemsTryDelete = 0;

		//Go throguh the items passed in the request body
		for(var index=0; index<req.body.newsFeedItems.length; index++) {
			//Call the method to delete a object to newfeed collection
			NewsFeed.deleteNewsFeedItem(req.body.newsFeedItems[index],function(err) {
				//If no err in saving then increment the count of number of items deleted
				if(!err) {
					numNewsFeedItemsSuccessDelete++;
				}

				//Increment the count of the number of tiems tries to delete
				numNewsFeedItemsTryDelete++;

				//This checks if we tries to delete all the items passed in the request. If we have go inside the if loop
				if(numNewsFeedItemsTryDelete === req.body.newsFeedItems.length) {
					//This checks if all the items have been sucessfully deleted. If it is true then send 200
					if(numNewsFeedItemsSuccessDelete === numNewsFeedItemsTryDelete) {
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