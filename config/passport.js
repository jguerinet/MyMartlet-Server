//Local username/password strategy used by this system
var LocalStrategy = require("passport-local").Strategy;

//The mongoose user model object
var User = require("../models/user");

module.exports = function(passport) {
	//When a user logs into our system we need to setup a session for them. This method returns the identifier that will be used to find the user
	//that has logged into the system in the subsequent requests they make. We use the mongoDB id that is generated when creating a new document as the session id
	passport.serializeUser(function(user,done) {
		done(null,user._id);
	});

	//This method when given the session finds the user object connected with this id
	passport.deserializeUser(function(id,done) {
		//Since we use the mongo id as the session id all we have to do is a findById to get the user object.
		User.findById(id,function(Err,user) {
			done(err,user);
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
		//Makes it asynchronous
		process.nextTick(function() {
			//Try to fins a user with the same email in the db
			User.findOne({"email": email}, function (err, user) {
				//If err then pass it to passport
				if (err) {
					return done(err);
				}

				//If no errs then pass null as err and false
				if (user) {
					return done(null, false);
				}
				//Otherwise everything is good
				else {
					//Create a new mongoose User object
					var newUser = new User(
						{
							Email: email,
							Password: password
						}
					);

					//Save them to the database
					newUser.save(function (err) {
						//If err saving then throw it
						if (err) {
							throw err;
						}

						//otherwise return null and the newUser object
						return done(null, newUser);
					});
				}
			});
		});
	}));
};
