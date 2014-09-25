//get the connect-roles module
var connectRoles = require("connect-roles");

//make a new connect roles object
var user  = new connectRoles({
	failureHandler: function (req, res, action) {
		// optional function to customise code that runs when
		// user fails authorisation
		var accept = req.headers.accept || '';

		//If the client accepts html then redirect to the lgin page
		if (~accept.indexOf('html')&&req.method === "get") {
			res.redirect("/login");
		}
		//Otherwise send 403
		else {
			res.status(403).end();
		}
	}
});
//get the roles constants
var roles = require("../constants/roles");

//The array of Auth entries who can view the content
var canViewContent = [roles.admin,roles.editor,roles.viewer];
//The array of Auth entries who can esit the content
var canEditContent = [roles.editor,roles.admin];
//The array of Auth entries who can edit the users
var canEditUsers = [roles.admin];

//The following few functions sets up the various middleware function that can be dropped into a route handler
user.use("view",function(req) {
	if(canViewContent.indexOf(req.user.Auth) > -1) {
		return true;
	}
});

user.use("edit",function(req) {
	if(canEditContent.indexOf(req.user.Auth) > -1) {
		return true;
	}
});

user.use("edit users",function(req) {
	if(canEditUsers.indexOf(req.user.Auth) > -1) {
		return true;
	}
});

module.exports = user;