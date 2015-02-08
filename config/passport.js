/**
 * Configures all the passport strategies
 * @module config/passport
 */

//Local username/password strategy used by this system
var LocalStrategy = require("passport-local").Strategy;

//The mongoose user model object
var Account = require("../models/account");

/**
 * The passport strategy for signing up a new user
 * @type {LocalStrategy}
 */
var localSignupStrategy = new LocalStrategy(
	{
		//Tell passport to use the email field in the request body as the username for the account
		usernameField: 'email',
		//Tell passport to use the password field in the request body as the password for the account
		passwordField: 'password'
	},
	//done has three params:
	//Err: Pass this into done if the there was a server error or null if the server responded as it should
	//User: Pass true if everything went smoothly or false if there was an error
	//UserErr: If User is false then pass the reason into this param.
	function(email, password, done) {
		//Call the mongoose method to signup a new user
		Account.signup({email: email, password: password}).then(
			//No errors
			function() {
				return done(null, true);
			},
			//Errors
			function(err) {
				//if it's a string then it's a user error
				if(typeof err == 'string') {
					return done(null, false, err);
				}

				//Otherwise a server or db error
				return done(err);
			}
		);
	}
);

/**
 * The passport strategy for logging in a user
 * @type {LocalStrategy}
 */
var localLoginStrategy = new LocalStrategy(
	{
		//Tell passport to use the email field in the request body as the username for the account
		usernameField: 'email',
		//Tell passport to use the password field in the request body as the password for the account
		passwordField: 'password'
	},
	//done has three params:
	//Err: Pass this into done if the there was a server error or null if the server responded as it should
	//User: Pass the Account to be logged in if everything went smoothly or false if there was an error
	//UserErr: If User is false then pass the reason into this param.
	function(email, password, done) {
		//Call the method to login the user
		Account.login({email: email, password: password}).then(
			//Success
			function(accountFound) {
				return done(null, accountFound);
			},
			function(err) {
				//if it's a string then it's a user error
				if(typeof err == 'string') {
					return done(null, false, err);
				}

				//Otherwise a server or db error
				return done(err);
			}
		);
	}
);

/**
 * The function which adds the strategies for signing up a user and logging in a user. Also adds defines the functions
 * to for associating a user to a session object (deserializeUser) and to add a user to a session (serializeUser).
 * @param passport {Passport} The object returned by the passport module
 */
module.exports = function(passport) {
	//When a user logs into our system we need to setup a session for them. This method returns the identifier that will
	// be used to find the use that has logged into the system in the subsequent requests they make. We use the
	// mongoDB id that is generated when creating a new document as the session id
	passport.serializeUser(function(account, done) {
		done(null, account._id);
	});

	//This method when given the session finds the user object connected with this id
	passport.deserializeUser(function(id, done) {
		//Since we use the mongo id as the session id all we have to do is a findById to get the user object.
		Account.findById(id,function(err, account) {
			done(err, account);
		});
	});

	//The startegy for signing up a new user to the system
	passport.use("local-signup", localSignupStrategy);

	//The strategy for logging in a user
	passport.use("local-login", localLoginStrategy);
};
