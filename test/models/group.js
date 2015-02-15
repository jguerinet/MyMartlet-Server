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

	describe('.putGroup', function() {
		afterEach(function() {
			if(Group.findOne.hasOwnProperty('restore')) {
				Group.findOne.restore();
			}

			if(Date.now.hasOwnProperty('restore')) {
				Date.now.restore();
			}

			if(Group.create.hasOwnProperty('restore')) {
				Group.create.restore();
			}

			if(Account.find.hasOwnProperty('restore')) {
				Account.find.restore();
			}

			if(Group.findOneAndUpdate.hasOwnProperty('restore')) {
				Group.findOneAndUpdate.restore();
			}
		});

		it('should be a static function', function() {
			assert.isFunction(Group.schema.statics.putGroup);
		});
		it('should take two args', function() {
			assert.equal(Group.putGroup.length, 2);
		});
		it('should return a promise', function(done) {
			var returned = Group.putGroup({},{});

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
		it('should try to find a Group with the passed query arg', function(done) {
			var query = {name: 'group', logoLink: 'logo'};

			var findOneSpy = sinon.spy(Group, 'findOne');

			function assertions() {
				try {
					sinon.assert.calledOnce(findOneSpy);
					sinon.assert.calledWithExactly(findOneSpy, query);
				}
				catch(err) {
					return done(err);
				}

				return done();
			}

			Group.putGroup(query, {}).then(
				function() {
					return assertions();
				},
				function(err) {
					return assertions();
				}
			);
		});
		it('should reject the promise if the find Group function call failed', function (done) {
			var findOneStub = sinon.stub(Group, 'findOne',
				function () {
					return {
						exec: function () {
							var deferred = q.defer();

							deferred.reject(new Error('stub error'));

							return deferred.promise;
						}
					}
				}
			);

			Group.putGroup().then(
				function () {
					return done(new Error('Promise was resolved'));
				},
				function (err) {
					if (err.message == 'stub error') {
						return done();
					}

					return done(err);
				}
			);
		});

		describe('case when a new Group has to be created', function() {
			it('should create a Group with the group arg if it did not find a Group', function (done) {
				var admin = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(admin).then(
					function (adminCreated) {
						var group = {
							name: 'group',
							logoLink: 'logo',
							createdAt: Date.now(),
							updatedAt: Date.now(),
							admins: [adminCreated.id]
						};

						var nowSpy = sinon.spy(Date, 'now');
						var createSpy = sinon.spy(Group, 'create');

						Group.putGroup(null, group).then(
							function () {
								try {
									sinon.assert.calledOnce(createSpy);
									sinon.assert.calledWithExactly(createSpy, {
										name: group.name,
										logoLink: group.logoLink,
										createdAt: nowSpy.getCall(0).returnValue,
										updatedAt: nowSpy.getCall(0).returnValue,
										admins: group.admins
									});
								}
								catch (err) {
									return done(err);
								}

								return done();
							},
							function (err) {
								return done(err);
							}
						);
					},
					function (err) {
						return done(err);
					}
				);
			});
			it('should reject the promise if the creation of the new Group failed', function (done) {
				var createGroupSpy = sinon.spy(Group, 'create');

				var group = {name: 'name'};

				Group.putGroup(null, group).then(
					function () {
						return done(new Error('The promise was resolved'));
					},
					function (actualError) {
						createGroupSpy.getCall(0).returnValue.then(
							null,
							function (expectedErr) {
								try {
									assert.deepEqual(actualError, expectedErr, 'Errors are not the same');
								}
								catch (err) {
									return done(err);
								}

								return done();
							}
						);
					}
				);
			});
			it('should update the Account.groups field of the Accounts who are admins of the Group', function (done) {
				var admin = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(admin).then(
					function (adminCreated) {
						var group = {
							name: 'group',
							logoLink: 'logo',
							createdAt: Date.now(),
							updatedAt: Date.now(),
							admins: [adminCreated.id]
						};

						var updateSpy = null;

						var findStub = sinon.stub(Account, 'find',
							function (query) {
								var object = {
									update: function (crit, update, options, cb) {
										return cb(null, null, null)
									},
									exec: function() {
										var deferred = q.defer();

										deferred.resolve([1]);

										return deferred.promise;
									}
								};

								updateSpy = sinon.spy(object, 'update');

								return object;
							}
						);

						Group.putGroup(null, group).then(
							function (groupCreated) {
								try {
									sinon.assert.calledTwice(findStub);
									sinon.assert.calledWithMatch(findStub, {'_id': {$in: groupCreated.admins}});
									sinon.assert.calledOnce(updateSpy);
									sinon.assert.calledWithMatch(updateSpy, {}, {$push: {groups: groupCreated.id}}, {multi: true});
								}
								catch (err) {
									return done(err);
								}

								return done();
							},
							function (err) {
								return done(err);
							}
						);
					},
					function (err) {
						return done(err);
					}
				);
			});
			it('should resolve the promise with the new Group created', function (done) {
				var admin = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(admin).then(
					function (adminCreated) {
						var group = {name: 'group', logoLink: 'logo', admins: [adminCreated.id]};

						var createSpy = sinon.spy(Group, 'create');

						Group.putGroup(null, group).then(
							function (groupCreated) {
								createSpy.getCall(0).returnValue.then(
									function (actualGroupCreated) {
										try {
											assert.deepEqual(groupCreated, actualGroupCreated);
										}
										catch (err) {
											return done(err);
										}

										return done();
									},
									null
								);
							},
							function (err) {
								return done(err);
							}
						);
					},
					function (err) {
						return done(err);
					}
				);
			});
			it('should reject the promise with the err of the update operation returns an error', function (done) {
				var admin = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(admin).then(
					function (adminCreated) {
						var group = {
							name: 'group',
							logoLink: 'logo',
							createdAt: Date.now(),
							updatedAt: Date.now(),
							admins: [adminCreated.id]
						};

						var updateSpy = null;

						var findStub = sinon.stub(Account, 'find',
							function (query) {
								var object = {
									update: function (update, doc, options, cb) {
										return cb(new Error('stub error'), null, null)
									},
									exec: function() {
										var deferred = q.defer();

										deferred.resolve([1]);

										return deferred.promise;
									}
								};

								updateSpy = sinon.spy(object, 'update');

								return object;
							}
						);

						Group.putGroup(null, group).then(
							function () {
								return done(new Error('The promise was resolved'));
							},
							function (err) {
								try {
									assert.equal(err.message, 'stub error');
								}
								catch (err) {
									return done(err);
								}

								return done();
							}
						);
					},
					function (err) {
						return done(err);
					}
				);
			});
		});

		describe('case when a Group has to be updated', function() {
			var accountCreated = null;

			beforeEach(function(done) {
				var account = {email: 'email', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(account).then(
					function(accountMade) {
						accountCreated = accountMade;
						return done();
					},
					function(err) {
						return done(err);
					}
				);
			});

			it('should update the found Group with the passed group arg', function(done) {
				var group = {name: 'group', logoLink: 'logo', createdAt: Date.now(), updatedAt: Date.now(), admins: [accountCreated.id]};

				Group.create(group).then(
					function(groupCreated) {
						var findOneAndUpdateSpy = sinon.spy(Group, 'findOneAndUpdate');

						group.name = 'groupTwo';
						group.logoLink = 'logoThree';
						group.createdAt = Date.now();

						var dateNowSpy = sinon.spy(Date, 'now');

						Group.putGroup({name: 'group'}, group).then(
							function() {
								try {
									sinon.assert.calledOnce(findOneAndUpdateSpy);
									sinon.assert.calledOnce(dateNowSpy);
									sinon.assert.calledWithMatch(findOneAndUpdateSpy, {name: 'group'}, {
										name: group.name,
										logoLink: group.logoLink,
										createdAt: groupCreated.createdAt,
										updatedAt: dateNowSpy.getCall(0).returnValue,
										admins: [accountCreated.id]
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

			it('should reject the promise with an Error if updating the Group fails', function(done) {
				var group = {name: 'group', logoLink: 'logo', createdAt: Date.now(), updatedAt: Date.now(), admins: [accountCreated.id]};

				Group.create(group).then(
					function() {
						var error = new Error('stub error');

						var findOneAndUpdateStub = sinon.stub(Group, 'findOneAndUpdate', function() {
							var exec = function() {
								var deferred = q.defer();

								deferred.reject(error);

								return deferred.promise;
							};

							return {
								exec: exec
							}
						});

						Group.putGroup({name: 'group'}, group).then(
							function() {
								return done(new Error('The promise was resolved'));
							},
							function(err) {
								try {
									assert.equal(err.message, error.message);
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

			it('should update the Account.groups field of any new Group.admins entries', function(done) {
				var newAdmin = {email: 'emailOne', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(newAdmin).then(
					function(newAdminCreated) {
						var group = {name: 'name', logoLink: 'logo', createdAt: Date.now(), updatedAt: Date.now(), admins: [accountCreated.id]};

						Group.create(group).then(
							function(groupCreated) {
								var updateSpy = null;

								var findStub = sinon.stub(Account, 'find', function(query) {
									var returned = {
										update: function(crit, update, options, cb) {
											return cb();
										}
									};

									updateSpy = sinon.spy(returned, 'update');

									return returned;
								});

								group.admins = [newAdminCreated.id, accountCreated.id];

								Group.putGroup({name: 'name'}, group).then(
									function() {
										try {
											sinon.assert.calledOnce(findStub);
											sinon.assert.calledWithExactly(findStub, {
												$and: [
													{
														'_id': {$in: [newAdminCreated._id]}
													},
													{
														groups: {$not: {$in: [newAdminCreated._id]}}
													}
												]
											});
											sinon.assert.calledOnce(updateSpy);
											sinon.assert.calledWithMatch(updateSpy, {}, {$push: {groups: groupCreated.id}}, {multi: true});
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

			it('should resolve the promise with nothing', function(done) {
				var group = {name: 'group', logoLink: 'logo', createdAt: Date.now(), updatedAt: Date.now(), admins: [accountCreated.id]};

				Group.create(group).then(
					function() {
						Group.putGroup({name: 'group'}, group).then(
							function(value) {
								try {
									assert.isNull(value);
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

			it('should reject the promise with an error if the update operation fails', function(done) {
				var newAdmin = {email: 'emailOne', password: 'pass', createdAt: Date.now(), updatedAt: Date.now()};

				Account.create(newAdmin).then(
					function(newAdminCreated) {
						var group = {name: 'name', logoLink: 'logo', createdAt: Date.now(), updatedAt: Date.now(), admins: [accountCreated.id]};

						Group.create(group).then(
							function() {
								var updateSpy = null;

								var findStub = sinon.stub(Account, 'find', function(query) {
									var returned = {
										update: function(crit, update, options, cb) {
											return cb(new Error('stub error'));
										}
									};

									updateSpy = sinon.spy(returned, 'update');

									return returned;
								});

								group.admins = [newAdminCreated.id];

								Group.putGroup({name: 'name'}, group).then(
									function() {
										return done(new Error('Promise was resolved'));
									},
									function(err) {
										try {
											assert.equal(err.message, 'stub error');
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
	});
});