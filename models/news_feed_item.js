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
	}
});

/**
 * The mongoose model for a NewsFeedItem
 * @type {NewsFeedItem}
 */
module.exports = mongoose.model('NewsFeedItem', newsFeedItemSchema);