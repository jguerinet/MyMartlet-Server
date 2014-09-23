//Method to connect to a mongoDB database
//mongoUri: The url of the running mongoDB database
//callback: The function to call once we are done
exports.connectToMongoDatabase = function(mongoUri,callback) {
	//Get the mongoose module
	var mongoose = require("mongoose");

	//Try to connect to the db
	mongoose.connect(mongoUri,function(err,res) {
		//If err then throw it
		if(err) {
			console.log("Error connecting to db");
			throw err;
		}
		//Otherwise log that we have connected and call the callback function
		else {
			console.log("Connected to mongoDB db: " + mongoUri);
			return callback();
		}
	});
};