var assert = require('chai').assert;
var sinon = require('sinon');
var q = require('q');
var mongoose = require('mongoose');

var NewsFeedItem = require('../../models/news_feed_item');
var Account = require('../../models/account');
var Group = require('../../models/group');

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
		q.all([NewsFeedItem.find({}).remove().exec(), Group.find({}).remove().exec(), Account.find({}).remove().exec()]).then(
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
		it('should not allow values before the current Date', function(done) {
			var liveDate = new Date();
			liveDate.setMonth(liveDate.getMonth() - 1);

			var newsFeedItem = {liveDate: liveDate};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done(new Error('The promise was resolved'));
				},
				function(err) {
					try {
						assert.isDefined(err.errors.liveDate, 'liveDate field has passed validation');
						assert.equal(err.errors.liveDate.message, 'liveDate field cannot be before the current Date', 'Incorrect error');
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
		});
		it('should allow values on the current Date', function(done) {
			var liveDate = new Date();

			var newsFeedItem = {liveDate: liveDate};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done();
				},
				function(err) {
					try {
						assert.isUndefined(err.errors.liveDate);
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
		});
		it('should allow values after the current Date', function(done) {
			var liveDate = new Date();
			liveDate.setMonth(liveDate.getMonth()+1);

			var newsFeedItem = {liveDate: liveDate};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done();
				},
				function(err) {
					try {
						assert.isUndefined(err.errors.liveDate);
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
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
		it('should not allow values before the current Date', function(done) {
			var endDate = new Date();
			endDate.setMonth(endDate.getMonth() - 1);

			var newsFeedItem = {endDate: endDate};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done(new Error('The promise was resolved'));
				},
				function(err) {
					try {
						assert.isDefined(err.errors.endDate, 'endDate field has passed validation');
						assert.equal(err.errors.endDate.message, 'endDate field cannot be before the current Date', 'Incorrect error');
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
		});
		it('should allow values on the current Date', function(done) {
			var endDate = new Date();

			var newsFeedItem = {endDate: endDate};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done();
				},
				function(err) {
					try {
						assert.isUndefined(err.errors.endDate);
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
		});
		it('should allow values after the current Date', function(done) {
			var endDate = new Date();
			endDate.setMonth(endDate.getMonth()+1);

			var newsFeedItem = {endDate: endDate};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done();
				},
				function(err) {
					try {
						assert.isUndefined(err.errors.endDate);
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
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
		it('should not allow values that do not point to a Group', function(done) {
			var newsFeedItem = {group: mongoose.Types.ObjectId()};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done(new Error('NewsFeedItem was created'));
				},
				function(err) {
					try {
						assert.isDefined(err.errors.group, 'group field has passed validation');
						assert.equal(err.errors.group.message, 'group must point to an existing Group');
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
		});
		it('should allow values that point to a Group', function(done) {
			var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

			Account.create(account).then(
				function(accountCreated) {
					var group = {name: 'group', admins: [accountCreated.id], createdAt: Date.now(), updatedAt: Date.now()};

					Group.create(group).then(
						function(groupCreated) {
							var newsFeedItem = {group: groupCreated.id};

							NewsFeedItem.create(newsFeedItem).then(
								function() {
									return done();
								},
								function(err) {
									try {
										assert.isUndefined(err.errors.group);
									}
									catch(err) {
										return done(err);
									}

									return done();
								}
							);
						},
						function(err) {
							return done(err);
						}
					);
				},
				function(err) {
					return done(err);
				}
			);
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
		it('should allow values that point to an Account', function(done) {
			var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

			Account.create(account).then(
				function(accountCreated) {
					var newsFeedItem = {createdBy: accountCreated.id};

					NewsFeedItem.create(newsFeedItem).then(
						function() {
							return done();
						},
						function(err) {
							try {
								assert.isUndefined(err.errors.createdBy);
							}
							catch(err) {
								return done(err);
							}

							return done();
						}
					);
				},
				function(err) {
					return done(err);
				}
			);
		});
		it('should not allow values that do not point to an Account', function(done) {
			var newsFeedItem = {createdBy: mongoose.Types.ObjectId()};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done(new Error('The promise was resolved'));
				},
				function(err) {
					try {
						assert.isDefined(err.errors.createdBy);
						assert.equal(err.errors.createdBy.message, 'createdBy must point to an existing Account');
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
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
		it('should allow values that point to an Account', function(done) {
			var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

			Account.create(account).then(
				function(accountCreated) {
					var newsFeedItem = {updatedBy: accountCreated.id};

					NewsFeedItem.create(newsFeedItem).then(
						function() {
							return done();
						},
						function(err) {
							try {
								assert.isUndefined(err.errors.updatedBy);
							}
							catch(err) {
								return done(err);
							}

							return done();
						}
					);
				},
				function(err) {
					return done(err);
				}
			);
		});
		it('should not allow values that do not point to an Account', function(done) {
			var newsFeedItem = {updatedBy: mongoose.Types.ObjectId()};

			NewsFeedItem.create(newsFeedItem).then(
				function() {
					return done(new Error('The promise was resolved'));
				},
				function(err) {
					try {
						assert.isDefined(err.errors.updatedBy);
						assert.equal(err.errors.updatedBy.message, 'updatedBy must point to an existing Account');
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
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