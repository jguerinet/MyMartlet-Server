var mongoose = require('mongoose');
var moment = require('moment-timezone');

var resetErrors = require('../err/reset');

var ResetSchema = new mongoose.Schema({
    User: String,
    Time: Date
});

//Creates a new reste object with the user's id and stores it in the collection
ResetSchema.statics.generateResetObject = function(userEmail,callback) {
	//Get the user model
	var User = mongoose.model('User');
	//Get the reset model
	var Reset = this;

	//Retreive the user whose email matches the passed userEmail parameters
	User.findOne({email: userEmail},function(err,userFound) {
		//If error then callback
		if(err||!userFound) {
			return callback();
		}
		//Otherwise create a new reset object and save it
		else {
			var reset = new Reset({
				User: userFound.id,
				Time: Date.now()
			});

			reset.save(function(err,savedReset) {
				//Return the reset mongoose object to the callback
				return callback(err,savedReset);
			});
		}
	});
};

//Used to validate the resetId that the client is using to reset their password
//resetId:Client's reset uid
ResetSchema.statics.validateResetId = function(resetId,callback) {
	//Try tp find a reste object in the the database with  the same passed resetId
	this.findById(resetId,function(err,resetFound) {
		//If err or no reset object found then pass te callback the correct err codes and the err object
		if(err||!resetFound) {
			callback(err,false,resetErrors.NO_RESET_FOUND);
		}
		//Otherwise continue
		else {
			//Check if the time in the reste object is within an hour of the current time. If it is not the
			//client has taken too long to reet the password so return the right error code
			if(moment().subtract('hours',1).isAfter(moment(resetFound.Time))) {
				callback(null,false,resetErrors.TIME_EXPIRED);
			}
			//Otherwise no errs so return true
			else {
				callback(null,true);
			}
		}
	});
};

//Finds the user in the the database whose object id matches the one in the reset object
ResetSchema.statics.getUser = function(resetId,callback) {
	//Find the reset object in the database whose resetId matches the the one passed to this method
	this.findById(resetId,function(err,resetFound) {
		//if err or no object found then pass the err's tp the callback function
		if(err||!resetFound) {
			callback(err,null);
		}
		//Otherwise continue
		else {
			//Get the user model
			var User = mongoose.model('User');

			//Find the user whose object id matches the User field in the found reset object
			User.findById(resetFound.User,function(err,userFound) {
				//If err or no user found call the callback with errs
				if(err||!userFound) {
					callback(err,false);
				}
				//Otherwise pass the user to the callback
				else {
					callback(null,userFound);
				}
			});
		}
	});
};

//Removes the reset object from the database
ResetSchema.statics.removeReset = function(resetId) {
	this.findById(resetId,function(err,reset) {
		if(reset) {
			reset.remove(function(err,product) {

			});
		}
	});
};

module.exports = mongoose.model('Reset',ResetSchema);

