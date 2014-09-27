var mongoose = require("mongoose");

var settingsUtil = require("../util/settings");

var modelTransforms = require("./model_transforms/news_feed");

var newsFeedSchema = new mongoose.Schema({
	//The unique identifier for this new feed item
	NewsFeedId: {
		type: Number,
		required: true
	},
	//The title of this news feed article
	Title: {
		type: String,
		required: true
	},
	//The text that appears below the title giving a description of the news
	Description: {
		type: String,
		default: null
	},
	//A link to go to when they click on the item
	Link: {
		type: String,
		default: null
	},
	//The date when this new feed expires and should no longer be shown
	ExpiryDate: {
		type: Date,
		required: true
	},
	//The date when this news feed item should start showing up
	LiveDate: {
		type: Date,
		default: Date.now()
	},
	//The last person who updated this value. Has their email
	LastUpdatedBy: {
		type: String,
		default: null
	},
	//The person who added this NewFeed item. Has their email
	AddedBy: {
		type: String,
		default: null
	},
	//The last time this object was updated
	LastUpdatedOn: {
		type: Date,
		default: null
	},
	//The date when this object was first added to the db
	AddedOn: {
		type: Date,
		default: null
	}
});

//Method to save anewsFeed object to the db. Decides whether it is a new item or old one and ecies what to do
newsFeedSchema.statics.saveNewsFeedItem = function(newsFeedItem,updatedBy,callback) {
	//Store the mongoose NewsFeed model in this var
	var NewsFeed = this;

	//Find NewsFeed document from the db with the same NewsFeedId as the passed one
	NewsFeed.findOne({NewsFeedId: newsFeedItem.NewsFeedId},function(err,newsFeedItemFound) {
		//If db err then pass to the callback
		if(err) {
			return callback(err);
		}
		//Otherwise if a NewsFeed doc was found
		else if(newsFeedItemFound) {
			//Update the properties of this document
			setupNewsFeedItemUpdate(newsFeedItemFound,newsFeedItem,updatedBy);

			//Save the update to the db
			newsFeedItemFound.save(function(err,newsFeedItemSaved,numAffected) {
				//If err then pass to the callback
				if(err) {
					return callback(err);
				}
				//Otherwise return null to the callback
				else {
					return callback();
				}
			});
		}
		//Otherwise it is a new object
		else {
			//Set up the new object
			setupNewNewsFeedItem(newsFeedItem,updatedBy);

			//Save it ot eh db but first create a mongoose object for it since it is a regular js object
			(new NewsFeed(newsFeedItem)).save(function(err,newsFeedItemSaved) {
				//If err pass to the callback
				if(err) {
					return callback(err);
				}
				//Otherwise call the callback with null
				else {
					return callback();
				}
			});
		}
	});
};

//Sets up a new NewsFeed item
function setupNewNewsFeedItem(newsFeedItem,addedBy) {
	//Get the unique id for this newsFeed object
	newsFeedItem.NewsFeedId = settingsUtil.getNewsFeedId();

	//Update all the Date fields
	newsFeedItem.AddedOn = Date.now();
	newsFeedItem.LastUpdatedOn = Date.now();

	//Update the AddedBy and LastUpdatedBy fields
	newsFeedItem.AddedBy = addedBy;
	newsFeedItem.LastUpdatedBy = addedBy;

	//If the LiveDate field is not set then update it to now
	if(!newsFeedItem.LiveDate) {
		newsFeedItem.LiveDate = Date.now();
	}
}

//newsFeedItem: The mongoose NewsFeed object that has to be updated
//newsFeedUpdate: the update object
//updatedbY: the user who issued the update
//Updates a NewsFeedItem object
function setupNewsFeedItemUpdate(newsFeedItem,newsFeedUpdate,updatedBy) {
	//Go through all the properties in the newsFeedUpdate object
	for(var property in newsFeedUpdate) {
		//Check if the current property is part of newsFeedUpdate object
		if(newsFeedUpdate.hasOwnProperty(property)) {
			//if it is then update the newsFeedItem.property
			newsFeedItem[property] = newsFeedUpdate[property];
		}
	}

	//Update the LstUpdatedON field
	newsFeedItem.LastUpdatedOn = Date.now();

	//Updated the LastUpdatedBy field
	newsFeedItem.LastUpdatedBy = updatedBy;
}

//Returns the array pf news feed object for the admin system
newsFeedSchema.statics.getObjectsForAdmin = function(callback) {
	//Get all the news feed objects
	this.find({},function(err,newsFeedDocs) {
		//if err then pass it to the callback
		if(err) {
			return callback(err);
		}
		else {
			//Make an array where we will put all the newFeed objects
			var newsFeedItems = [];

			//Go through the retreived docs and convert to object and pply the adminTransform to the roObject function
			for(var index=0; index<newsFeedDocs.length; index++) {
				newsFeedItems.push(newsFeedDocs[index].toObject({transform:modelTransforms.adminTransform}));
			}

			//Return the array to the calback
			return callback(null,newsFeedItems);
		}
	});
};

//Generate the mongoose model object for a NewsFeed using the above schema and module export it
module.exports = mongoose.model("NewsFeed",newsFeedSchema);

