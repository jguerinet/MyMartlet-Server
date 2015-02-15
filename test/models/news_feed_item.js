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

	describe('#liveDate', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.liveDate);
		});
		it('should be of type Date', function() {
			assert.equal(NewsFeedItem.schema.paths.liveDate.constructor.name, 'SchemaDate');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.liveDate.options.required);
		});
	});

	describe('#endDate', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.endDate);
		});
		it('should be of type Date', function() {
			assert.equal(NewsFeedItem.schema.paths.endDate.constructor.name, 'SchemaDate');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.endDate.options.required);
		});
	});

	describe('#group', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.group);
		});
		it('should be of type ObjectId pointing to a Group', function() {
			assert.equal(NewsFeedItem.schema.paths.group.constructor.name, 'ObjectId', 'Not of type ObjectId');
			assert.equal(NewsFeedItem.schema.paths.group.options.ref, 'Group', 'Not pointing to a Group');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.group.options.required);
		});
	});

	describe('#createdBy', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.createdBy);
		});
		it('should be of type ObjectId pointing to an Account', function() {
			assert.equal(NewsFeedItem.schema.paths.createdBy.constructor.name, 'ObjectId', 'Not of type ObjectId');
			assert.equal(NewsFeedItem.schema.paths.createdBy.options.ref, 'Account', 'Not pointing to an Account');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.createdBy.options.required);
		});
	});

	describe('#updatedBy', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.updatedBy);
		});
		it('should be of type ObjectId pointing to an Account', function() {
			assert.equal(NewsFeedItem.schema.paths.updatedBy.constructor.name, 'ObjectId', 'Not of type ObjectId');
			assert.equal(NewsFeedItem.schema.paths.updatedBy.options.ref, 'Account', 'Not pointing to an Account');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.updatedBy.options.required);
		});
	});

	describe('#createdAt', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.createdAt);
		});
		it('should of type Date', function() {
			assert.equal(NewsFeedItem.schema.paths.createdAt.constructor.name, 'SchemaDate');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.createdAt.options.required);
		});
	});

	describe('#updatedAt', function() {
		it('should be an instance field', function() {
			assert.isObject(NewsFeedItem.schema.paths.updatedAt);
		});
		it('should of type Date', function() {
			assert.equal(NewsFeedItem.schema.paths.updatedAt.constructor.name, 'SchemaDate');
		});
		it('should have a required option', function() {
			assert.isTrue(NewsFeedItem.schema.paths.updatedAt.options.required);
		});
	});
});