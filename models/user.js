//get the mongoose object to defined a mongoose schema and model
var mongoose = require("mongoose");

//The schema for a user of this system
var userSchema = new mongoose.Schema({
	//The email address of the user with which they will log into the system
	Email: {
		type: String,
		required: true,
		unique: true
	},
	//The password of their account
	Password: {
		type: String,
		required: true
	}
});

//Make a mongoose model out of the schema
module.exports = mongoose.model("User",userSchema);