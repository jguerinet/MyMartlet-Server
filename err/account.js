/**
 * Has the error messages for the {@link module:models/account|models/account} module
 * @module err/account
 */

/**
 * @typedef {object} AccountErrors
 * @property emailNotFound {string} The error message returned by {@link Account.login|Account.login} when the
 * 					                user entered email was not found in the db
 * @property incorrectPassword {string} The error message returned by {@link Account.login|Account.login}
 * 					  					when the user entered password does not match with the one in the db
 */

/**
 * Exports an object with the error messages as properties.
 * @type {AccountErrors}
 */
module.exports = {
	emailNotFound: 'No user with that email found',
	incorrectPassword: 'Incorrect password'
};