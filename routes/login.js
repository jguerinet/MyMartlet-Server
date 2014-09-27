//The function that adds all the /login route handlers
module.exports = function(app,passport) {
	//Make an express router to handle the /login routes
	var loginRouter = require("express").Router();

	//The POST /login route handler. Call the passport local-login strategy as a route middleware. Yhis decides whether to login the user based on his entered credentials
	loginRouter.post("/",passport.authenticate("local-login"),function(req,res) {
		//Eveything went well send 200.
		//TODO Redirect to the admin panel
		res.status(200).end();
	});

	//The GET route handler for the /login route
	loginRouter.get("/",function(req,res) {
		//redner and send the login.jade file
		res.render("account/login/login");
	});

	//Use the loginRouter for the /login routes
	app.use("/login",loginRouter);

	app.get("/",function(req,res) {
		res.redirect("/login");
	});
};