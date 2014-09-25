var mongoose = require("mongoose");

var settingsSchema = new mongoose.Schema({
	//This object stores the next unique id tat can be used for a particular db document
	UniqueIds: {
		//The next unqiue id for a NewsFeed document
		NewsFeedId: {
			type: String,
			default: 0
		}
	},
	//The last time when the data in the server was changed. Used to decide whether to send a 304 if a client sends an If-Modified-Since
	LastModified: {
		type: Date,
		requireD: true
	}
});

//Updates the NewsFeedId value in the db by incrementing it by one
settingsSchema.statics.updateNewsFeedId = function(){
	//Gte the setting sobject and icnrement the NewsFeedId var by one
	this.findOne({},function(err,settingsFound) {
		settingsFound.update({$inc: {'UniqueIds.NewsFeed': 1}}).exec();
	});
};

//Make a mongoose model for the Settings object using the above schema and export it
module.exports = mongoose.model("Settings",settingsSchema);