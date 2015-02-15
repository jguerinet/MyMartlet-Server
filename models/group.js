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
 * Either updates the Group found with the query arg object with the group arg or creates a new Group with the group arg
 * @param query {Object} The criteria for the mongoDB find query.
 * @param group {Group} The object to update an old Group with or ti create a new Group with.
 * @returns {Q.promise.<Group|Error>} If a new Group was created then resolves with it, If a Group was updated then
 * 									  resolves with nothing. Rejects with an Error object
 */
groupSchema.statics.putGroup = function(query, group) {
	//Create a promise
	var deferred = q.defer();

	//Store the Group model
	var Group = this;

	//Find a Group using the query arg
	Group.findOne(query).exec().then(
		//Success
		function(groupFound) {
			//If a Group was not found
			if(!groupFound) {
				//Gte the current Date and set it to the group's createdAt and updatedAt fields
				var currentDate = Date.now();

				group.createdAt = currentDate;
				group.updatedAt = currentDate;

				//Create a group in the db with the group arg
				Group.create(group).then(
					//Success
					function(groupCreated) {
						//Update all the Account.groups fields of the admins of this group
						mongoose.model('Account').find({'_id': {$in: groupCreated.admins}})
							.update({}, {$push: {groups: groupCreated.id}}, {multi: true}, function(err, numberAffected) {
								//If Update err then reject the promise
								if(err) {
									return deferred.reject(err);
								}

								//Resolve the promise with the new Group
								return deferred.resolve(groupCreated);
							});
					},
					//Create Error
					function(err) {
						//Reject the promise
						return deferred.reject(err);
					}
				);
			}
			//If a Group was found
			else {
				//Set the createdAt to the found Group's createdAt to prevent a user overwriting it
				group.createdAt = groupFound.createdAt;
				//Update the updatedAt field
				group.updatedAt = Date.now();

				//Update the found groups with the group arg
				Group.findOneAndUpdate(query, group).exec().then(
					//Update Success
					function(groupUpdated) {
						//Stores all the new admins for the group
						var newAdmins = [];

						//Go through all the admins inthe updated Group
						groupUpdated.admins.forEach(function(updatedAdmin) {
							//Tracks if the current admin is a new one
							var isNewAdmin = true;

							//Go through all the admins in the old Group
							groupFound.admins.forEach(function(admin) {
								//if the id fields match
								if(admin.id == updatedAdmin.id) {
									//This is a an old admin
									isNewAdmin = false;
									return false;
								}
							});

							//New admin so add it to the newAdmins array
							if(isNewAdmin) {
								newAdmins.push(updatedAdmin);
							}
						});

						//Update the Account.groups of all the new admins who do not already have a reference to the
						//Group with the Group's id
						mongoose.model('Account').find({$and: [{'_id': {$in: newAdmins}}, {groups: {$not: {$in: newAdmins}}}]})
							.update({}, {$push: {groups: groupFound.id}}, {multi: true}, function(err) {
								//If Update err Reject the promise
								if(err) {
									return deferred.reject(err);
								}

								//Resolve with nothing
								return deferred.resolve(null);
							});
					},
					//Group Update Err. Reject the promise
					function(err) {
						return deferred.reject(err);
					}
				);
			}
		},
		//Find Error. Reject the promise
		function(err) {
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