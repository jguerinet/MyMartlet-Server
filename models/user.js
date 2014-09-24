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
	}
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