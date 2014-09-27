//Initialsie the admin app
angular.module("mymartlet.admin",['ui.router','ui.bootstrap',"mymartlet.admin.newsfeed"])
	//Add constants used in this file
	.constant("AdminConstants",{
		configUrl: "/admin/api/GetConfig"
	})
	//Configure the app.
	.config(function($stateProvider,AdminConstants) {
		//Configures ui.router states
		$stateProvider
			//The admin state. More like a configuration state where we get the data required to show the different views
			.state("admin", {
				resolve: {
					//This resolve function gets the admin config object from /admin/apiGetConfig and saved the objects
					config: function($http,$rootScope) {
						return $http.get(AdminConstants.configUrl)
							.success(function(config) {
								//Parse the received config json to a js object
								var configObject = angular.fromJson(config);

								//Set the app's news feed array to the array in the config object
								$rootScope.newsFeed= configObject.NewsFeed;
							})
					}
				},
				//Add the sidebar view
				views: {
					"sidebar@": {
						//If there is no controller the view wont render
						controller: function () {

						},
						templateUrl: "/admin/partials/sidebar.html"
					}
				}
			})
			//The home state. The intial state of the app
			.state("admin.home", {
				url: "/home",
				views: {
					"content@": {
						controller: function(){},
						templateUrl: "/admin/partials/home.html"
					}
				}
			})
			//The state that shows all the news feed items
			.state("admin.newsFeed",{
				url: "/NewsFeed",
				views: {
					"content@": {
						controller: "NewsFeedController",
						templateUrl: "/admin/partials/news_feed.html"
					}
				}
			});
	})
	//When the app starts running
	.run(function($state) {
		//Go to the home stats
		$state.go("admin.home");
	});