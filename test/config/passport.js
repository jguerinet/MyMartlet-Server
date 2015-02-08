var assert = require('chai').assert;
var httpMocks = require('node-mocks-http');
var passport = require('passport');
var sinon = require('sinon');

require('../../config/passport')(passport);
passport.initialize();
passport.session();

var Account = require('../../models/account');

var next = function(err) {};

describe('config/passport', function() {
	before(function(next) {
		require('../../util/db').connectToMongoDatabase('mongodb://localhost:27017:mymartlet', function(err) {
			if(err) {
				throw err;
			}

			return next();
		});
	});

	afterEach(function(next) {
		Account.find().remove().exec(
			function() {
				return next();
			},
			function(err) {
				return next(err);
			}
		);
	});

	describe('~localSignupStrategy', function() {
		it('should call the Account.signup static method with right params', function(done) {
			var signupSpy = sinon.spy(Account, 'signup');

			after(function() {
				Account.signup.restore();
			});

			var account = {email: 'email', password: 'password'};

			var req = httpMocks.createRequest({
				method: 'POST',
				body: account
			});

			var res = httpMocks.createResponse();

			passport.authenticate('local-signup', function() {
				try {
					assert.isTrue(signupSpy.calledOnce, 'Account.signup was not called');
					signupSpy.alwaysCalledWithExactly(account);
				}
				catch(err) {
					return done(err);
				}

				return done();
			})(req, res, next);
		});
	});

	describe('~localLoginStrategy', function() {
		it('should call the Account.login static method with right params', function(done) {
			var loginSpy = sinon.spy(Account, 'login');

			after(function() {
				Account.login.restore();
			});

			var account = {email: 'email', password: 'password'};

			var req = httpMocks.createRequest({
				method: 'POST',
				body: account
			});

			var res = httpMocks.createResponse();

			passport.authenticate('local-login', function() {
				try {
					assert.isTrue(loginSpy.calledOnce, 'Account.login was not called');
					loginSpy.alwaysCalledWithExactly(account);
				}
				catch(err) {
					return done(err);
				}

				return done();
			})(req, res, next);
		});
	});
});
