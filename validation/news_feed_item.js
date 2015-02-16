var mongoose = require('mongoose');

/**
 * Has all the validation function for the properties in a {@link NewsFeedItem}
 * @module validation/news_feed_item
 */

/**
 * @typedef MongooseValidator
 * @type {object}
 * @property validator {Function} The function that decides whether the validation has passed or not
 * @property msg {string} The message to return on a failed validation
 */

/**
 * The array of validators for the liveDate field
 * @type {MongooseValidator[]}
 */
exports.liveDate = [
	/**
	 * Checks if the value is after or the same as today
	 * @type MongooseValidator
	 */
	{
		validator: function (liveDate) {
			var currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);

			if(liveDate < currentDate) {
				return false;
			}

			return true;
		},
		msg: 'liveDate field cannot be before the current Date'
	}
];

/**
 * The array of validators for the endDate field
 * @type {MongooseValidator[]}
 */
exports.endDate = [
	/**
	 * Checks if the value is after or the same as today
	 * @type MongooseValidator
	 */
	{
		validator: function (endDate) {
			var currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);

			if(endDate < currentDate) {
				return false;
			}

			return true;
		},
		msg: 'endDate field cannot be before the current Date'
	}
];

/**
 * The array of validators for the group field
 * @type {MongooseValidator[]}
 */
exports.group = [
	/**
	 * Checks if the value points to a Group in the db
	 * @type MongooseValidator
	 */
	{
		validator: function(group, next) {
			mongoose.model('Group').findById(group).exec().then(
				function(groupFound) {
					if(groupFound) {
						return next(true);
					}

					return next(false);
				},
				function(err) {
					return next(err);
				}
			);
		},
		msg: 'group must point to an existing Group'
	}
];

/**
 * The array of validators for the createdBy field
 * @type {MongooseValidator[]}
 */
exports.createdBy = [
	/**
	 * Checks if the value of the field points to an Account in the db
	 * @type {MongooseValidator}
	 */
	{
		validator: function(createdBy, next) {
			mongoose.model('Account').findById(createdBy).exec().then(
				function(accountFound) {
					if(accountFound) {
						return next(true);
					}

					return next(false);
				},
				function(err) {
					return next(err);
				}
			);
		},
		msg: 'createdBy must point to an existing Account'
	}
];

/**
 * The array of validators for the updatedBy field
 * @type {MongooseValidator[]}
 */
exports.updatedBy = [
	/**
	 * Checks if the field value points to an Account in the db
	 * @type {MongooseValidator}
	 */
	{
		validator: function(updatedBy, next) {
			mongoose.model('Account').findById(updatedBy).exec().then(
				function(accountFound) {
					if(accountFound) {
						return next(true);
					}

					return next(false);
				},
				function(err) {
					return next(err);
				}
			);
		},
		msg: 'updatedBy must point to an existing Account'
	}
];