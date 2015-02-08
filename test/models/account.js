var assert = require('chai').assert;
var bcrypt = require('bcrypt-nodejs');
var sinon = require('sinon');

var error = require('../../err').account;

describe('Account', function() {
	var Account = null;

	before(function(next) {
		require('../../util/db').connectToMongoDatabase('mongodb://localhost:27017:mymartlet', function(err) {
			if(err) {
				throw err;
			}

			Account = require('../../models/account');

			return next();
		});
	});

	describe('#email', function() {
		it('should be an instance field', function() {
			assert.isObject(Account.schema.paths.email);
		});
		it('should be of type string', function() {
			assert.equal(Account.schema.paths.email.constructor.name, 'SchemaString');
		});
		it('should be a required field', function() {
			assert.isTrue(Account.schema.paths.email.options.required);
		});
		it('should have a unique index', function() {
			assert.isTrue(Account.schema.paths.email.options.unique);
		});
	});

	describe('#password', function() {
		it('should be an instance field', function() {
			assert.isObject(Account.schema.paths.password);
		});
		it('should be of type string', function() {
			assert.equal(Account.schema.paths.password.constructor.name, 'SchemaString');
		});
	});

	describe('#type', function() {
		it('should be an instance field', function() {
			assert.isObject(Account.schema.paths.type);
		});
		it('should be of type string', function() {
			assert.equal(Account.schema.paths.type.constructor.name, 'SchemaString');
		});
		it('should be an enum with values [pending, viewer, editor, admin]', function() {
			assert.deepEqual(Account.schema.paths.type.enumValues, ['pending', 'viewer', 'editor', 'admin']);
		});
		it('should have a default value of pending', function() {
			assert.equal(Account.schema.paths.type.defaultValue, 'pending');
		});
		it('should be required', function() {
			assert.isTrue(Account.schema.paths.type.options.required);
		});
	});

	describe('#createdAt', function() {
		it('should be an instance field', function() {
			assert.isObject(Account.schema.paths.createdAt);
		});
		it('should be of type Date', function() {
			assert.equal(Account.schema.paths.createdAt.constructor.name, 'SchemaDate');
		});
		it('should be required', function() {
			assert.isTrue(Account.schema.paths.createdAt.options.required);
		});
	});

	describe('#updatedAt', function() {
		it('should be an instance field', function() {
			assert.isObject(Account.schema.paths.updatedAt);
		});
		it('should be of type Date', function() {
			assert.equal(Account.schema.paths.updatedAt.constructor.name, 'SchemaDate');
		});
		it('should be required', function() {
			assert.isTrue(Account.schema.paths.updatedAt.options.required);
		});
	});

	describe('#signup', function() {
		beforeEach(function(next) {
			Account.find().remove().exec(
				function() {
					return next();
				},
				function(err) {
					throw err;
				}
			);
		});

		after(function(next) {
			Account.find().remove().exec(
				function() {
					return next();
				},
				function(err) {
					throw err;
				}
			);
		});

		it('should be an instance method', function() {
			assert.isFunction(Account.schema.methods.signup);
		});
		it('should return a Promise object', function() {
			assert.equal(new Account({email: 'email', password: 'password'}).signup().constructor.name, 'Promise');
		});
		it('should save the Account to the db and the password field should be hashed', function(done) {
			var account = {email: 'yulrics@gmail.com', password: 'password'};

			new Account(account).signup().then(
				function(accountSaved) {
					Account.find({
						email: account.email
					}).exec().then(
						function(accountsFound) {
							try {
								assert.equal(accountsFound.length, 1);
								assert.isTrue(bcrypt.compareSync(account.password, accountsFound[0].password))
							}
							catch(err) {
								return done(err);
							}

							return done();
						},
						function(err) {
							throw err;
						}
					);
				},
				function(err) {
					throw err;
				}
			);
		});
		it('should resolve the promise with the saved Account', function(done) {
			var account = {email: 'yulrics@gmail.com', password: 'pass'};

			new Account(account).signup().then(
				function(accountSaved) {
					try {
						assert.equal(accountSaved.constructor.modelName, 'Account');
						assert.equal(accountSaved.email, account.email);
						assert.isTrue(bcrypt.compareSync(account.password, accountSaved.password));
					}
					catch(err) {
						return done(err);
					}

					return done();
				},
				function(err) {
					throw err;
				}
			);
		});
		it('should convert the email to lower case before saving it to the db', function(done) {
			var account = {email: 'YuLrIcS@gMail.cOm', password: 'pass'};

			new Account(account).signup().then(
				function() {
					Account.findOne({email: account.email.toLowerCase()}).exec().then(
						function(accountFound) {
							try {
								assert.isNotNull(accountFound);
							}
							catch(err) {
								return done(err);
							}

							return done();
						},
						function(err) {
							throw err;
						}
					);
				},
				function(err) {
					throw err;
				}
			);
		});
		it('should the value of the type field to pending', function(done) {
			var account = {email: 'yulrics@gmail.com', password: 'pass', type: 'admin'};

			new Account(account).signup().then(
				function() {
					Account.findOne({email: account.email, type: 'pending'}).exec().then(
						function(accountFound) {
							try {
								assert.isNotNull(accountFound);
							}
							catch(err) {
								return done(err);
							}

							return done();
						},
						function(err) {
							throw err;
						}
					);
				},
				function(err) {
					throw err;
				}
			);
		});
		it('should set the createdAt and updatedAt fields to the result of Date.now()', function(done) {
			var dateNowSpy = sinon.spy(Date, 'now');

			after(function() {
				Date.now.restore();
			});

			var account = {email: 'yulrics@gmail.com', password: 'pass', type: 'admin'};

			new Account(account).signup().then(
				function(accountSaved) {
					try {
						assert.isTrue(dateNowSpy.called, 'Date.now() not called');
						assert.equal(accountSaved.createdAt.valueOf(), dateNowSpy.returnValues[1].valueOf());
						assert.equal(accountSaved.updatedAt.valueOf(), dateNowSpy.returnValues[1].valueOf());
					}
					catch(err) {
						return done(err);
					}

					return done();
				},
				function(err) {
					throw err;
				}
			);
		});
	});

	describe('#login', function() {
		beforeEach(function(next) {
			Account.find().remove().exec(
				function() {
					return next();
				},
				function(err) {
					throw err;
				}
			);
		});

		after(function(next) {
			Account.find().remove().exec(
				function() {
					return next();
				},
				function(err) {
					throw err;
				}
			);
		});

		it('should be a instance function', function() {
			assert.isFunction(Account.schema.methods.login);
		});
		it('should return a Promise', function() {
			assert.equal(new Account({email: 'email', password: 'password'}).login().constructor.name, 'Promise');
		});
		it('should reject the promise if the email was not found in the db', function(done) {
			new Account({email: 'email', password: 'password'}).login().then(
				function() {
					return done(new Error('Promise was resolved'));
				},
				function(err) {
					try {
						assert.equal(err, error.emailNotFound);
					}
					catch(err) {
						return done(err);
					}

					return done();
				}
			);
		});
		it('should reject with the promise if the password was not correct', function(done) {
			var account = new Account({email: 'email', password: 'pass'});

			account.signup().then(
				function() {
					account.password = 'pass1';

					account.login().then(
						function() {
							return done(new Error('Promise was resolved'));
						},
						function(err) {
							try {
								assert.equal(err, error.incorrectPassword);
							}
							catch(err) {
								return done(err);
							}

							return done();
						}
					);
				},
				function(err) {
					throw err;
				}
			);
		});
		it('should resolve the promise with the right Account object', function(done) {
			var account = {email: 'email', password: 'pass'};

			new Account(account).signup().then(
				function() {
					new Account(account).login().then(
						function(accountFound) {
							try {
								assert.equal(accountFound.constructor.modelName, 'Account');
								assert.equal(accountFound.email, account.email);
								assert.isTrue(bcrypt.compareSync(account.password, accountFound.password));
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
					throw err;
				}
			);
		});
	});
});

