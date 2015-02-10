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
 * The mongoose model for a group
 * @type {Group}
 */
module.exports = mongoose.model('Group', groupSchema);