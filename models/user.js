//get the mongoose object to defined a mongoose schema and model
var mongoose = require("mongoose");

//Module used to hash user passwords
var bcrypt = require("bcrypt-nodejs");

//The err codes for signning up a user
var signupErr = require("../err/signup");

//All the authRoles
var authRoles = require("../constants/roles");

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

//Method to signup a new user
//The user object should have the following fields: {email:string,password:string,confPassword:string}
userSchema.statics.signup = function(user,callback) {
	//Store the mongoose Use model object
	var User = this;

	//Try to find a user from the db with the same email as the passed one
	this.findOne({Email:user.email},function(err,userFound) {
		//If mongoose err pass it to the callback
		if(err) {
			return callback(err);
		}
		//Otherwise if we found a user with the same email
		else if(userFound) {
			//pass a err object with the right err code
			return callback({err:signupErr.emailExistsErr});
		}
		//Check if the 2 passwords entered match. If they don't pass an err object with the right err code
		else if(user.password != user.confPassword){
			return callback({err:signupErr.passDoNotMatch});
		}
		//Otherwise no problem. Construct a mongoose Uer and sve to the db
		else {
			(new User({Email:user.email,Password:User.generateHash(user.password),Auth:authRoles.pending})).save(function(err,userSaved) {
				//If err saving user pass to the callback
				if(err) {
					return callback(err);
				}
				//Otherwise pass null as err to the callback
				else {
					return callback(null);
				}
			});
		}
	});
};

//Make a mongoose model out of the schema
module.exports = mongoose.model("User",userSchema);