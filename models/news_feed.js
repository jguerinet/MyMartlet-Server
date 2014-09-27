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
//itemIndex: an identifier which we return to the callback
newsFeedSchema.statics.saveNewsFeedItem = function(newsFeedItem,itemIndex,updatedBy,callback) {
	//Store the mongoose NewsFeed model in this var
	var NewsFeed = this;

	//Find NewsFeed document from the db with the same NewsFeedId as the passed one
	NewsFeed.findOne({NewsFeedId: newsFeedItem.NewsFeedId},function(err,newsFeedItemFound) {
		//If db err then pass to the callback
		if(err) {
			return callback(err,null,itemIndex);
		}
		//Otherwise if a NewsFeed doc was found
		else if(newsFeedItemFound) {
			//Update the properties of this document
			setupNewsFeedItemUpdate(newsFeedItemFound,newsFeedItem,updatedBy);

			//Save the update to the db
			newsFeedItemFound.save(function(err,newsFeedItemSaved,numAffected) {
				//If err then pass to the callback
				if(err) {
					return callback(err,null,itemIndex);
				}
				//Otherwise return null to the callback
				else {
					return callback(null,newsFeedItemSaved,itemIndex);
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
					return callback(err,newsFeedItemSaved,itemIndex);
				}
				//Otherwise call the callback with null
				else {
					return callback(null,newsFeedItemSaved,itemIndex);
				}
			});
		}
	});
};

//Saves an array of newsFeedItems to the db
//newsFeedItems: The array of newsFeedItems to save
//updatedBy: The email addr of the person who pushed the update
//callback: The function once it is done
newsFeedSchema.statics.saveNewsFeedItems = function(newsFeedItems,updatedBy,callback) {
	//The count of the number of items we have attempted to save
	var numItemsTriedSaved = 0;

	//The mongoose model for a NewsFeedItem
	var NewsFeed = this;

	//Stores the objects that have been saved to the db in the same order that they were sent to the sevrer
	var newsFeedItemsSaved = [];

	//Go through the newsFeedItems to save
	for(var index=0; index<newsFeedItems.length; index++) {
		//Call the static NewsFeed method to save a newsFeed to the db passing it the person who called the update and the
		//index of the object we are saving
		NewsFeed.saveNewsFeedItem(newsFeedItems[index],updatedBy,index,function(err,newsFeedItemSaved,itemIndex) {
			//Increment the count of objects tries to save
			numItemsTriedSaved++;

			//Add the returned newsFeedItemSaved var to the arry at the returned itemIndex var
			newsFeedItemsSaved.splice(itemIndex,0,newsFeedItemSaved);

			//Check if we have tries to save all the objects
			if(numItemsTriedSaved === newsFeedItems.length) {
				//If we have then go through the newsFeedItemsSaved an apply the adminTransform to each object
				for(var newsFeedItemIndex=0; newsFeedItemIndex<newsFeedItemsSaved.length; newsFeedItemIndex++) {
					newsFeedItemsSaved[newsFeedItemIndex] = newsFeedItemsSaved[newsFeedItemIndex].toObject({transform:modelTransforms.adminTransform});
				}

				//Return the array to the callback
				return callback(newsFeedItemsSaved);
			}
		});
	}
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

//Retuens the array of news feed objects for mobile devices
newsFeedSchema.statics.getObjectsForMobile = function(callback) {
	//Get all the news feed objects from the db
	this.find({},function(err,newsFeedDocs) {
		//If err pass it to the callback
		if(err) {
			return callback(err);
		}
		//Otheriwse
		else {
			//Make an array called newsFeedItems where all the objects willbe stores
			var newsFeedItems = [];

			//Go through the returned docs and convert them to js bjects using the passed transform. Push each transformed js object to the array
			for(var index=0; index<newsFeedDocs.length; index++) {
				newsFeedItems.push(newsFeedDocs[index].toObject({transform:modelTransforms.mobileTransform}));
			}

			//Pass the array to the callback
			return callback(null,newsFeedItems);
		}
	});
};

//Removed the passed newsFeed item from the db
newsFeedSchema.statics.deleteNewsFeedItem = function(newsFeedItem,callback) {
	this.remove({NewsFeedId:newsFeedItem.NewsFeedId},function(err,newsFeedItemDeleted) {
		return callback(err);
	});
};

//Generate the mongoose model object for a NewsFeed using the above schema and module export it
module.exports = mongoose.model("NewsFeed",newsFeedSchema);

