//The function that sets up the signup routes
module.exports = function(app,passport) {
	//Express router object for the /signup routes
	var signupRouter = require("express").Router();

	//The /signup post handler. The middleware is the passport local-signup strategy to signup new users to the system
	signupRouter.post("/",function(req,res,next) {
		//Call the passport authenticate inside the route handler since we want to send different response when a username is already present
		passport.authenticate("local-signup",function(err,user,info) {
			//If sevrer err then send 500
			if(err) {
				res.status(500).end();
			}
			//If user with that email is already present then send 409 as well as the err code associated with this err
			else if(user === false) {
				res.status(409).end(JSON.stringify(info));
			}
			//Otheriwse send 200
			else {
				//TODO Do a redirect to the login page
				res.status(200).end();
			}
		})(req,res,next);
	});

	//The route handler for the GET /signup route
	signupRouter.get("/",function(req,res) {
		//Server the signup.jade file
		res.render("account/signup/signup");
	});

	//Use the signupRouter with / as the base url
	app.use("/",signupRouter);
};