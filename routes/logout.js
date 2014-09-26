module.exports = function(app) {
	//Route to logout a user
	app.get("/logout",function(req,res) {
		req.logout();
		res.redirect("/login");
	});
};