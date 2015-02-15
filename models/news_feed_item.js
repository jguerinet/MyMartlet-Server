/**
 * Exports the mongoose model for a {@link NewsFeedItem}
 * @module models/news_feed_item
 */

var mongoose = require('mongoose');

var validation = require('../validation/news_feed_item');

/**
 * @class
 * @alias NewsFeedItem
 */
var newsFeedItemSchema = new mongoose.Schema({
	/**
	 * The title for this Item
	 * @alias NewsFeedItem#title
	 * @type {!string}
	 */
	title: {
		type: String,
		required: true,
		trim: true
	},
	/**
	 * The description for this Item
	 * @alias NewsFeedItem#description
	 * @type {string}
	 */
	description: {
		type: String,
		trim: true
	},
	/**
	 * The starting Date from which this item is valid
	 * @alias NewsFeedItem#liveDate
	 * @type {!Date}
	 */
	liveDate: {
		type: Date,
		required: true
	},
	/**
	 * The Date after the liveDate when this item is no longer valid
	 * @alias NewsFeedItem#endDate
	 * @type {!Date}
	 */
	endDate: {
		type: Date,
		required: true
	},
	/**
	 * The ref to the group this NewsFeedItem was submitted.
	 * @alias NewsFeedItem#group
	 * @type {!ObjectId}
	 */
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true
	},
	/**
	 * The ref to the Account that made this item.
	 * @alias NewsFeedItem#createdBy
	 * @type {!ObjectId}
	 */
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	},
	/**
	 * The ref to the Account that last changed this item.
	 * @alias NewsFeedItem#updatedBy
	 * @type {!ObjectId}
	 */
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	},
	/**
	 * The Date when this item was first created.
	 * @alias NewsFeedItem#createdAt
	 * @type {!Date}
	 */
	createdAt: {
		type: Date,
		required: true
	}
});

/**
 * The mongoose model for a NewsFeedItem
 * @type {NewsFeedItem}
 */
module.exports = mongoose.model('NewsFeedItem', newsFeedItemSchema);