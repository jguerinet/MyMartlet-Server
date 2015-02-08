/**
 * The module that declares the schema for an Account and creates a mongoose model from it
 * @module models/account
 */

var mongoose = require('mongoose');
var q = require('q');
var bcrypt = require('bcrypt-nodejs');

var error = require('../err').account;

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
 * @alias Account.signup
 * @param account {Object} The object that has the properties with which to build the new Account
 * @param account.email {string} The email of the new Account
 * @param account.password {string} The un-hashed password of the new account
 * @returns {Q.promise} Resolves with the Account saved. Rejects with the Error object.
 */
accountSchema.statics.signup = function(account) {
	//Create a promise
	var deferred = q.defer();

	if(account.email) {
		//Convert the email to lower case and trim any extra spaces
		account.email = account.email.toLowerCase().trim();
	}

	//Set the type of pending since this is a new account
	account.type = 'pending';
	//Hash the password
	account.password = bcrypt.hashSync(account.password, bcrypt.genSaltSync(8), null);

	var currentDate = Date.now();
	//Update the date fields
	account.createdAt = currentDate;
	account.updatedAt = currentDate;

	//Save the account to the db
	this.create(account, function(err, accountCreated) {
		//Error
		if(err) {
			//Reject the promise
			return deferred.reject(err);
		}

		//Success. Resolve with the updated Account
		return deferred.resolve(accountCreated);
	});

	//Return the promise
	return deferred.promise;
};

/**
 * Determines if the passed Account should be allowed to log into the system.
 * @alias Account.login
 * @param account {Object} The object which login fields
 * @param account.email {string} The email of the account
 * @param account.password {string} The un-hashed password of the account
 * @returns {Q.promise} Resolves with the matching Account document. Rejects with an string message for user errors
 * 						or an Error object for db errors.
 */
accountSchema.statics.login = function(account) {
	//Create a promise
	var deferred = q.defer();

	//if the email field exists then convert it to lower case and trim it
	if(account.email) {
		account.email = account.email.toLowerCase().trim();
	}

	//Find an Account document in the db with the same email as the passed account.
	this.findOne({email: account.email}).exec().then(
		//Success
		function(accountFound) {
			//if we did not find an account then reject with the user message
			if(!accountFound) {
				return deferred.reject(error.emailNotFound);
			}

			//if the password's do not match then reject with the user message
			if(!bcrypt.compareSync(account.password, accountFound.password)) {
				return deferred.reject(error.incorrectPassword);
			}

			//All good. Resolve with the account document
			return deferred.resolve(accountFound);
		},
		//Error
		function(err) {
			//Reject with the mongo error
			return deferred.reject(err);
		}
	);

	//Return the promise
	return deferred.promise;
};

/**
 * Exports the Mongoose model for an Account
 * @type {Account}
 */
module.exports = mongoose.model('Account', accountSchema);