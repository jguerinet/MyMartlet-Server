/**
 * Exports the mongoose model for a Group
 * @module models/group
 */

var mongoose = require('mongoose');
var q = require('q');

var validations = require('../validation/group');

/**
 * Represents a set of users to associate a particular news feed item to.
 * @class
 * @alias Group
 */
var groupSchema = new mongoose.Schema({
	/**
	 * The name of the group. Cannot be empty or null
	 * @alias Group#name
	 * @type {!string}
	 */
	name: {
		type: String,
		required: true,
		trim: true
	},
	/**
	 * The link to the logo of the group
	 * @alias Group#logoLink
	 * @default null
	 * @type {string}
	 */
	logoLink: {
		type: String,
		trim: true,
		default: null
	},
	/**
	 * The array of admins for this group. Each array entry has an ObjectId which is a reference to an Account.
	 * The field cannot be an empty array, null or undefined.
	 * @alias Group#admins
	 * @type {ObjectId[]}
	 */
	admins: {
		type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
		validate: validations.admins
	},
	/**
	 * The date when this Group was first created
	 * @alias Group#createdAt
	 * @type {Date}
	 */
	createdAt: {
		type: Date,
		required: true
	},

	/**
	 * The date when this Group was last updated
	 * @alias Group#updatedAt
	 * @type {Date}
	 */
	updatedAt: {
		type: Date,
		required: true
	}
}, {collection: 'groups'});

/**
 * Method to get an array of groups from the db which meet the passed query's criteria
 * @alias Group.getGroups
 * @param query {Object} The object used to query mongodb with
 * @returns {Q.promise} Resolves an array of Groups. Rejects with an error.
 */
groupSchema.statics.getGroups = function(query) {
	//Make a promise
	var deferred = q.defer();

	//Send the query to the db
	this.find(query).exec().then(
		//Success
		function(groupsFound) {
			//Resolve the promise with the array of Groups
			return deferred.resolve(groupsFound);
		},
		//Error
		function(err) {
			//Reject the promise with the err
			return deferred.reject(err);
		}
	);

	//Return the promise
	return deferred.promise;
};

/**
 * Deletes a Group from the db that matches the passed query. Also removes the references to this Group
 * from the Account.groups array.
 * @param query {Object} The query for which Group to remove from the db
 * @returns {Q.promise.<|Error>}
 */
groupSchema.statics.deleteGroup = function(query) {
	//Make a promise
	var deferred = q.defer();

	//Store the reference to the Group model
	var Group = this;

	//Execute the query to remove the Group from the db that meets the query object
	Group.findOneAndRemove(query).exec().then(
		//Success
		function(groupRemoved) {
			//If a Group was removed
			if(groupRemoved) {
				//Update the groups array of all the Accounts that have a reference to the Group
				mongoose.model('Account').update({'$pull': {groups: groupRemoved.id}}, function (err) {
					//If error
					if (err) {
						//Create the removed Group again
						Group.create(groupRemoved).then(
							//Success
							function() {
								//Reject the promise with the err that cause the Account update to fail
								return deferred.reject(err);
							},
							//Error
							function(err) {
								//Reject the promise with the error
								return deferred.reject(err);
							}
						);
					}
					//No error
					else {
						//Resolve the promise
						return deferred.resolve();
					}
				});
			}
			//No groups were removed
			else {
				//Resolve the promise
				return deferred.resolve();
			}
		},
		//Error
		function(err) {
			//Reject the promise with the Error
			return deferred.reject(err);
		}
	);

	//Return the promise
	return deferred.promise;
};

/**
 * The mongoose model for a group
 * @type {Group}
 */
module.exports = mongoose.model('Group', groupSchema);