/**
 * The module that declares the schema for an Account and creates a mongoose model from it
 * @module models/Account
 */

var mongoose = require('mongoose');
var q = require('q');
var bcrypt = require('bcrypt-nodejs');

/**
 * The Mongoose model for an Account
 * @class
 * @alias Account
 */
var accountSchema = new mongoose.Schema({
		/**
		 * The email the user used to create their account with. Has to be unique within the accounts collection.
		 * @type {string}
		 * @memberof Account
		 * @instance
		 */
		email: {
			type: String,
			required: true,
			unique: true
		},
		/**
		 * The password for this account object. The password will be hashed using bcrypt.
		 * @type {string}
		 * @memberof Account
		 * @instance
		 */
		password: {
			type: String,
			required: true
		},
		/**
		 * <p>The type of account. Can have one of four values:</p>
		 * <p>pending: Default value. The user will not be able to see the admin system and will be shown a pending message.</p>
		 * <p>viewer: The user will only be able to view the admin system.</p>
		 * <p>editor: The user can view and edit the admin system data.</p>
		 * <p>admin: The highest account type. Can do all of the above and also edit certain account information.</p>
		 * @type {string}
		 * @memberof Account
		 * @default pending
		 * @instance
		 */
		type: {
			type: String,
			required: true,
			default: 'pending',
			enum: ['pending', 'viewer', 'editor', 'admin']
		},
		/**
		 * The date this account was created
		 * @type {Date}
		 * @memberof Account
		 * @instance
		 */
		createdAt: {
			type: Date,
			required: true
		},
		/**
		 * The date this account was last updated
		 * @type {Date}
		 * @memberof Account
		 * @instance
		 */
		updatedAt: {
			type: Date,
			required: true
		}
	},
	//The name of the collection used to store the account documents
	{collection: 'accounts'});

/**
 * Used to add a new Account to the db. The Account should only have the email and the un-hashed password.
 * @alias Account#signup
 * @returns {Q.promise} Resolves with the Account saved. Rejects with the Error object.
 */
accountSchema.methods.signup = function() {
	//Create a promise
	var deferred = q.defer();

	//Store the Account instance
	var self = this;

	//Convert the email to lower case and trim any extra spaces
	self.email = this.email.toLowerCase().trim();
	//Set the type of pending since this is a new account
	self.type = 'pending';
	//Hash the password
	self.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
	//Update the date fields
	self.createdAt = Date.now();
	self.updatedAt = Date.now();

	//Save the account to the db
	self.save(function(err) {
		//Error
		if(err) {
			//Reject the promise
			return deferred.reject(err);
		}

		//Success. Resolve with the updated Account
		return deferred.resolve(self);
	});

	//Return the promise
	return deferred.promise;
};

/**
 * Exports the Mongoose model for an Account
 * @type {Account}
 */
module.exports = mongoose.model('Account', accountSchema);