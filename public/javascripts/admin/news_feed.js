angular.module("mymartlet.admin.newsfeed",[]);

function NewsFeedFactory() {
	var newsFeedFactory = {};

	//Returns a new NewsFeed object
	newsFeedFactory.getNewNewsFeedItem = function() {
		return {
			NewsFeedId: null,
			Title: "",
			Description: "",
			Link: "",
			ExpiryDate: Date.now(),
			LiveDate: Date.now()
		}
	}
}

angular.module("mymartlet.admin.newsfeed")
	.factory("NewsFeedFactory",NewsFeedFactory);
