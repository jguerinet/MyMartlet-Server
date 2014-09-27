//The function that adds all the route handlers for the /admin routes
module.exports = function(app) {
	//Make an express router for the /admin routes
	var adminRouter = require("express").Router();

	//The middleware for this router
	adminRouter.use(function(req,res,next) {
		//Check if the client making this request is logged in. If he is then proceed to the next middleware
		if(req.user) {
			//Check if his account is pending
			if(req.user.Auth === "pending") {
				//if it is then shoe the psngin page
				res.render("admin/partials/pending");
			}
			//Otherwise proceed to the next middleware
			else {
				next();
			}
		}
		//Otherwise
		else {
			//if the method is a post then send a 401 indicating that the user ha to log in to proceed
			if(req.method === "POST") {
				res.status(401).end();
			}
			//otherwise redirect to the /login page
			else {
				res.redirect("/login");
			}
		}
	});

	///admin route pass in index.jade
	adminRouter.get("/",function(req,res) {
		res.render("admin/index",
			{
				navbar: {
					subTitle: "Logged in as " + req.user.Email
				}
			});
	});

	//Add the /admin/api routes
	require("./api")(adminRouter);

	//Add all the /admin/partials routes
	require("./partials")(adminRouter);

	//Add the router to the app object
	app.use("/admin",adminRouter);
};