/**
 * Exports the mongoose model for a Group
 * @module models/group
 */

var mongoose = require('mongoose');

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
		type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}]
	}
}, {collection: 'groups'});

var Group = mongoose.model('Group', groupSchema);

//Validation to make sure the admins field cannot be an empty array, null or undefined
Group.schema.path('admins').validate(function(value) {
	//Check if the value is null or undefined
	if(value) {
		//Check if the array is not empty
		if(value.length != 0) {
			//All good
			return true;
		}
	}

	//Validation failed
	return false;
}, 'Invalid admins');

/**
 * The mongoose model for a group
 * @type {Group}
 */
module.exports = Group;