var assert = require('chai').assert;
var mongoose = require('mongoose');

var Group = require('../../models/group');

describe('Group', function() {
	before(function(next) {
		require('../../util/db').connectToMongoDatabase('mongodb://localhost:27017/mymartlet', function() {
			return next();
		});
	});

	after(function() {
		mongoose.disconnect();
	});

	afterEach(function(next) {
		Group.find().remove().exec(
			function() {
				return next();
			},
			function(err) {
				throw err;
			}
		);
	});

	describe('#name', function() {
		it('should have be an instance variable', function() {
			assert.isObject(Group.schema.paths.name);
		});
		it('should be a string', function() {
			assert.equal(Group.schema.paths.name.constructor.name, 'SchemaString');
		});
		it('should be required', function() {
			assert.isTrue(Group.schema.paths.name.options.required);
		});
		it('should have the trim option', function() {
			assert.isTrue(Group.schema.paths.name.options.trim);
		});
	});

	describe('#logoLink', function() {
		it('should be an instance variable', function() {
			assert.isObject(Group.schema.paths.logoLink);
		});
		it('should be a string', function() {
			assert.equal(Group.schema.paths.logoLink.constructor.name, 'SchemaString');
		});
		it('should have the trim option', function() {
			assert.isTrue(Group.schema.paths.logoLink.options.trim);
		});
		it('should have a default value of null', function() {
			assert.equal(Group.schema.paths.logoLink.defaultValue, null);
		});
	});

	describe('#admins', function() {
		it('should be an instance variable', function() {
			assert.isObject(Group.schema.paths.admins);
		});
		it('should be an array of ObjectIds', function() {
			assert.equal(Group.schema.paths.admins.constructor.name, 'SchemaArray', 'It\'s not an array');
			assert.equal(Group.schema.paths.admins.caster.constructor.name, 'ObjectId',
				'The array should have only ObjectId\'s');
		});
		it('should be a ref to an Account', function() {
			assert.equal(Group.schema.paths.admins.caster.options.ref, 'Account');
		});
		it('should give an error if the array is empty when saving', function(done) {
			var group = {name: 'name', admins: []};

			Group.create(group, function(err, groupCreated) {
				if(groupCreated) {
					return done(new Error('The group was created with an empty array'));
				}

				if(err.errors.admins) {
					if(err.errors.admins.message == 'Invalid admins') {
						return done();
					}
				}

				return done(err);
			});
		});
		it('should give an error if the field is null when saving', function(done) {
			var group = {name: 'name', admins: null};

			Group.create(group, function(err, groupCreated) {
				if(groupCreated) {
					return done(new Error('The group was created with an empty array'));
				}

				if(err.errors.admins) {
					if(err.errors.admins.message == 'Invalid admins') {
						return done();
					}
				}

				return done(err);
			});
		});
		it('should give an error if the field is undefined when saving', function(done) {
			var group = {name: 'name', admins: undefined};

			Group.create(group, function(err, groupCreated) {
				if(groupCreated) {
					return done(new Error('The group was created with an empty array'));
				}

				if(err.errors.admins) {
					if(err.errors.admins.message == 'Invalid admins') {
						return done();
					}
				}

				return done(err);
			});
		});
		it('should only contain entries which match to an Account', function(done) {
			var group = {name: 'name', admins: [mongoose.Types.ObjectId()]};

			Group.create(group, function(err, groupCreated) {
				if(groupCreated) {
					return done(new Error('The group was created'));
				}

				return done();
			});
		});
	});

	describe('#createdAt', function() {
		it('should be an instance variable', function() {
			assert.isObject(Group.schema.paths.createdAt);
		});
		it('should be of type Date', function() {
			assert.equal(Group.schema.paths.createdAt.constructor.name, 'SchemaDate');
		});
		it('should be required', function() {
			assert.isTrue(Group.schema.paths.createdAt.options.required);
		});
	});

	describe('#updatedAt', function() {
		it('should be an instance variable', function() {
			assert.isObject(Group.schema.paths.updatedAt);
		});
		it('should be of type Date', function() {
			assert.equal(Group.schema.paths.updatedAt.constructor.name, 'SchemaDate');
		});
		it('should be required', function() {
			assert.isTrue(Group.schema.paths.updatedAt.options.required);
		});
	});
});