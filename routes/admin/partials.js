module.exports = function(adminRouter) {
	//The connect roles to provide authorization
	var userRoles = require("../../config/connect_roles");

	//The route to get the sidebar.html file. Only users with permission higher than pending can get this file
	adminRouter.get("/partials/sidebar.html",userRoles.can("view"),function(req,res) {
		res.render("admin/partials/sidebar");
	});
};