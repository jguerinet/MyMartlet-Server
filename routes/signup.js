//The function that sets up the signup routes
module.exports = function(app,passport) {
	//Express router object for the /signup routes
	var signupRouter = require("express").Router();

	//The /signup post handler. The middleware is the passport local-signup strategy to signup new users to the system
	signupRouter.post("/",passport.authenticate("local-signup"),function(req,res) {
		//Everything went well
		//TODO Make proper response
		res.send(200);
	});

	//Use the signupRouter with /signup as the base url
	app.use("/signup",signupRouter);
};