var assert = require('chai').assert;
var mongoose = require('mongoose');
var sinon = require('sinon');
var q = require('q');

var Group = require('../../models/group');
var Account = require('../../models/account');

describe('Group', function() {
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
		q.all([Group.find().remove().exec(), Account.find().remove().exec()]).then(
			function() {
				return next();
			},
			function(err) {
				return next(err);
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

	describe('.getGroups', function() {
		it('should be a static function', function() {
			assert.isFunction(Group.schema.statics.getGroups);
		});
		it('should take only one param', function() {
			assert.equal(Group.getGroups.length, 1);
		});
		it('should return a promise', function() {
			assert.equal(Group.getGroups().constructor.name, 'Promise');
		});
		it('should call the Group.find method with the right params', function(done) {
			after(function() {
				Group.find.restore();
			});

			var getGroupsSpy = sinon.spy(Group, 'find');

			var query = {name: 'groupName', logoLink: 'logoLink'};

			Group.getGroups(query).then(
				function() {
					try {
						assert.isTrue(getGroupsSpy.calledOnce);
						sinon.assert.calledWithExactly(getGroupsSpy, query);
					}
					catch(err) {
						return done(err);
					}

					return done();
				},
				function(err) {
					return done(err);
				}
			);
		});
		it('should reject the promise with an Error', function() {
			//TODO Figure out how to do this
			return true;
		});
		it('should resolve with right array of Groups', function(done) {
			var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

			var groupOne = {name: 'group', createdAt: Date.now(), updatedAt: Date.now()};
			var groupTwo = {name: 'group', createdAt: Date.now(), updatedAt: Date.now()};

			Account.create(account, function(err, accountCreated) {
				if(err) {
					return done(err);
				}

				groupOne.admins = [accountCreated._id];
				groupTwo.admins = [accountCreated._id];

				q.all([Group.create(groupOne), Group.create(groupTwo)]).spread(
					function() {
						Group.getGroups({name: 'group'}).then(
							function(groupsFound) {
								try {
									assert.equal(groupsFound.length, 2);
									groupsFound.forEach(function(groupFound) {
										assert.equal(groupFound.constructor.modelName, 'Group');
									});
								}
								catch(err) {
									return done(err);
								}

								return done();
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
	});

	describe('.deleteGroup', function() {
		afterEach(function() {
			if(Group.findOneAndRemove.hasOwnProperty('restore')) {
				Group.findOneAndRemove.restore();
			}
			if(Account.update.hasOwnProperty('restore')) {
				Account.update.restore();
			}

			if(Group.create.hasOwnProperty('create')) {
				Group.create.restore();
			}
		});

		it('should be a static function', function() {
			assert.isFunction(Group.schema.statics.deleteGroup);
		});
		it('should should take one arg', function() {
			assert.equal(Group.deleteGroup.length, 1);
		});
		it('should return a promise', function(done) {
			var returned = Group.deleteGroup();

			assert.equal(returned.constructor.name, 'Promise');

			returned.then(
				function() {
					return done();
				},
				function() {
					return done();
				}
			);
		});
		it('it should delete the Group that matches with the passed query arg', function(done) {
			var groupFindOneAndRemoveSpy = sinon.spy(Group, 'findOneAndRemove');

			var query = {name: 'groupName'};

			Group.deleteGroup(query).then(
				function() {
					try {
						sinon.assert.calledOnce(groupFindOneAndRemoveSpy);
						sinon.assert.calledWithExactly(groupFindOneAndRemoveSpy, query);
					}
					catch(err) {
						return done(err);
					}

					return done();
				},
				function(err) {
					return done(err);
				}
			);
		});
		it('should update the groups array of all the Accounts that have a reference to the deleted Group', function(done) {
			var accountUpdateSpy = sinon.spy(Account, 'update');

			var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

			Account.create(account).then(
				function(accountCreated) {
					var group = {name: 'group', admins: [accountCreated.id], createdAt: Date.now(), updatedAt: Date.now()};

					Group.create(group).then(
						function(groupCreated) {
							var deleteGroupQuery = {name: 'group'};

							Group.deleteGroup(deleteGroupQuery).then(
								function() {
									try {
										sinon.assert.calledOnce(accountUpdateSpy);
										sinon.assert.calledWithMatch(accountUpdateSpy, {$pull: {groups: groupCreated.id}});
									}
									catch(err) {
										return done(err);
									}

									return done();
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
				},
				function(err) {
					return done(err);
				}
			);
		});
		it('should add back the Group if the updating the Accounts failed', function(done) {
			var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

			var accountUpdateStub = sinon.stub(Account, 'update',
				function(update, cb) {
					return cb(new Error('stub error'));
				}
			);

			Account.create(account).then(
				function(accountCreated) {
					var group = {name: 'group', admins: [accountCreated.id], createdAt: Date.now(), updatedAt: Date.now()};

					Group.create(group).then(
						function(groupCreated) {
							var deleteGroupQuery = {name: 'group'};

							var groupCreateSpy = sinon.spy(Group, 'create');

							Group.deleteGroup(deleteGroupQuery).then(
								function() {
									return done(new Error('Function was resolved'));
								},
								function(err) {
									if(err.message == 'stub error') {
										try {
											sinon.assert.calledOnce(groupCreateSpy);
											assert.equal(groupCreateSpy.getCall(0).args[0].id, groupCreated.id);
										}
										catch (err) {
											return done(err);
										}

										return done();
									}

									return done(err);
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
});