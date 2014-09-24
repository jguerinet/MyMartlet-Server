//get the mongoose object to defined a mongoose schema and model
var mongoose = require("mongoose");

//Module used to hash user passwords
var bcrypt = require("bcrypt-nodejs");

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
	},
	//Can have 4 values:
	//Pending: Not allowed to views content
	//Viewer: Allowed to view content but not edit
	//Editor: Allowed to edit content
	//Admin: Allowed to view content, edit content and also change the Auth field of other users
	Auth: {
		type: String,
		required: true
	}
});

//The pre save middleware. Called before this is saved to the db
userSchema.pre("save",function(next) {
	//Make the email to lower case
	this.Email = this.Email.toLowerCase();
	//Call the next middleware in line
	next();
});

//Generates a hash for the passed variable. Mainly used to generate a hash for a user's password
userSchema.statics.generateHash = function(toHash) {
	return bcrypt.hashSync(toHash,bcrypt.genSaltSync(8),null);
};

//Used to check if the user entered password in the login page matches the hashed one in the db
userSchema.statics.verifyPassword = function(hashedPassword,password) {
	return bcrypt.compareSync(password,hashedPassword);
};

//Make a mongoose model out of the schema
module.exports = mongoose.model("User",userSchema);