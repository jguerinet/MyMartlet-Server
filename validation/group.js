/**
 * Has all the validation function for the properties in a {@link Group}
 * @module validation/group
 */

/**
 * @typedef MongooseValidator
 * @type {object}
 * @property validator {Function} The function that decides whether the validation has passed or not
 * @property msg {string} The message to return on a failed validation
 */

/**
 * The array of validators for the admins field
 * @type {MongooseValidator[]}
 */
exports.admins = [
	/**
	 * Checks if the field is an empty array, null or undefined.
	 * @type MongooseValidator
	 */
	{
		validator: function (admins) {
			//Check if the value is null or undefined
			if (admins) {
				//Check if the array is not empty
				if (admins.length != 0) {
					//All good
					return true;
				}
			}

			//Validation failed
			return false;
		},
		msg: 'Invalid admins'
	},
	/**
	 * Check if the entries in the array point to an Account.
	 * @type MongooseValidator
	 */
	{
		validator: function (admins, done) {
			mongoose.model('Group').find({'_id': {$in: admins}}).exec().then(
				function (accountsFound) {
					if(accountsFound.length == admins.length) {
						return done(true)
					}

					return done(false);
				},
				function (err) {
					console.log(err);
					return done(false);
				}
			);
		},
		msg: 'Contains entries that do not point to an Account'
	}
];