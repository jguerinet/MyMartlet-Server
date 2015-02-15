var assert = require('chai').assert;
var sinon = require('sinon');
var q = require('q');
var mongoose = require('mongoose');

var NewsFeedItem = require('../../models/news_feed_item');

describe('NewsFeedItem', function() {
	before(function(next) {
		require('../../util/db').connectToMongoDatabase('mongodb://localhost:27017/mymartlet', function() {
			return next();
		});
	});

	after(function(next) {
		mongoose.disconnect(function() {
			return next();
		});
	});

	afterEach(function(next) {
		q.all([NewsFeedItem.find({}).remove().exec()]).then(
			function() {
				return next();
			},
			function(err) {
				return next(err);
			}
		);
	});

	it('should export the mongoose model for a NewsFeedItem', function() {
		assert.equal(NewsFeedItem.modelName, 'NewsFeedItem');
	});

	describe('#title', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.title);
		});
		it('should be of type String', function() {
			assert.equal(NewsFeedItem.schema.paths.title.constructor.name, 'SchemaString');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.title.options.required);
		});
		it('should have a trim option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.title.options.trim);
		});
	});

	describe('#description', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.description);
		});
		it('should be of type String', function() {
			assert.equal(NewsFeedItem.schema.paths.description.constructor.name, 'SchemaString');
		});
		it('should have a trim option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.description.options.trim);
		});
	});
});