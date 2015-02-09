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
	}
}, {collection: 'groups'});

/**
 * The mongoose model for a group
 * @type {Group}
 */
module.exports = mongoose.model('Group', groupSchema);