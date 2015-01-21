//This method adds all the routes to the app object
module.exports = function(app,passport) {
	//Add the /signup routes
	require("./signup")(app,passport);

	//Add the /login routes
	require("./login")(app,passport);

	//Add the /admin routes
	require("./admin")(app);

	//Add the log out route
	require("./logout")(app);

	//Route to get the config for the mobile devices
	require("./config")(app);

	//Route for the the mobile devices api routes
	require("./api")(app);

    app.get("/",function(req,res) {
        res.render("index.html");
    });
};
