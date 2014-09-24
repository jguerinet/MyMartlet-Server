//This method adds all the routes to the app object
module.exports = function(app,passport) {
	//Add the /signup routes
	require("./signup")(app,passport);
};
