/**
 * Exports the mongoose model for a {@link NewsFeedItem}
 * @module models/news_feed_item
 */

var mongoose = require('mongoose');

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
	}
});

/**
 * The mongoose model for a NewsFeedItem
 * @type {NewsFeedItem}
 */
module.exports = mongoose.model('NewsFeedItem', newsFeedItemSchema);