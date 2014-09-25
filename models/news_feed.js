var mongoose = require("mongoose");

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
	}
});

//Generate the mongoose model object for a NewsFeed using the above schema and module export it
module.exports = mongoose.model("NewsFeed",newsFeedSchema);

