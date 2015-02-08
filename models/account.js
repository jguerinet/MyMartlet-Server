/**
 * The module that declares the schema for an Account and creates a mongoose model from it
 * @module models/Account
 */

var mongoose = require('mongoose');

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
		 * @type {date}
		 * @memberof Account
		 * @instance
		 */
		createdAt: {
			type: Date,
			required: true
		},
		/**
		 * The date this account was last updated
		 * @type {date}
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
 * Exports the Mongoose model for an Account
 * @type {Account}
 */
module.exports = mongoose.model('Account', accountSchema);