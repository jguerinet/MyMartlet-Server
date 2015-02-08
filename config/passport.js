//Local username/password strategy used by this system
var LocalStrategy = require("passport-local").Strategy;

//The mongoose user model object
var Account = require("../models/account");

module.exports = function(passport) {
	//When a user logs into our system we need to setup a session for them. This method returns the identifier that will be used to find the user
	//that has logged into the system in the subsequent requests they make. We use the mongoDB id that is generated when creating a new document as the session id
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
	passport.use("local-signup",new LocalStrategy({
		//The name of the username field that passport should be looking for
		usernameField: "email",
		//The name of the password field that passport should be looking for
		passwordField: "password",
		//Pass the req to the callback
		passReqToCallback: true
	},function(req,email,password,done) {
		//Call the mongoose method to signup a new user
		new Account({email:email, password:password}).signup().then(
			function(accountCreated) {
				return done(null, true);
			},
			function(err) {
				if(typeof err == 'string') {
					return done(null, false, err);
				}

				return done(err);
			}
		);
	}));

	//The strategy for logging in a user
	passport.use("local-login",new LocalStrategy({
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	},function(req,email,password,done) {
		new Account({email: email, password: password}).login().then(
			function(accountFound) {
				return done(null, accountFound);
			},
			function(err) {
				if(typeof err == 'string') {
					return done(null, false, err);
				}

				return done(err);
			}
		);
	}));
};
