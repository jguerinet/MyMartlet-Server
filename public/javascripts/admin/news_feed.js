angular.module("mymartlet.admin.newsfeed",[])
	.constant("NewsFeedConstants",{
		saveNewsFeedUrl: "/admin/api/save_news_feed"
	});

//A angularjs factory. Has methods to hekp the NewsFeedController
function NewsFeedFactory($http,$rootScope,NewsFeedConstants) {
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
	};

	//Generates a new panel model (represents the panel in the news feed view)
	newsFeedFactory.generatePanelModel = function(newsFeedItem) {
		return {
			//The value of the checkbox at the right hand side of the panel heading
			checkbox: false,

			//Whether the panel is collapsed or not
			collapsed: true,
			//Setter
			setCollapsed: function(isCollapsed) {
				this.collapsed = isCollapsed;
			},
			//Getter
			getCollapsed: function() {
				return this.collapsed;
			},

			//The data that this view is representing
			dataModel: newsFeedItem
		}
	};

	//generates a model representing the aciont button at the right hand side of the page
	newsFeedFactory.generateActionButtonModel = function() {
		return {
			//Whether the button is disabled or not
			disabled: true,
			//Setter
			setDisabled: function(isDisabled) {
				this.disabled = isDisabled;
			}
		}
	};

	//Goes through the panelModels and sees if any of the checkbox fields has a value of true
	//If nay of them are tru return true immediately. If none of them are tru return false
	newsFeedFactory.areAnyPanelCheckboxesSet = function(panelModels) {
		for(var index=0; index<panelModels.length; index++) {
			if(panelModels.checkbox) {
				return true;
			}
		}

		return false;
	};

	//Returns an array of newsFeedItem extracted from the passed
	//panelModels objects whose checkbox field has been set to true
	newsFeedFactory.getSelectedNewsFeedItems = function(panelModels) {
		var selectedNewsFeedItems = [];

		for(var index=0; index<panelModels.length; index++) {
			if(panelModels[index].checkbox) {
				selectedNewsFeedItems.push(panelModels[index].dataModel);
			}
		}

		return selectedNewsFeedItems;
	};

	//Makes a post request to the server to save the passed newsFeedItems to the server's db.
	//The passed callback is called one we are done with the post request and the server sends a response
	newsFeedFactory.postNewsFeedItems = function(newsFeedItems,callback) {
		$http.post(NewsFeedConstants.saveNewsFeedUrl,{newsFeedItems:$rootScope.newsFeed})
			.success(function() {
				callback(null);
			})
			.error(function(response, data, status, header) {
				callback(data,response);
			})
	};

	return newsFeedFactory;
}

angular.module("mymartlet.admin.newsfeed")
	.factory("NewsFeedFactory",NewsFeedFactory);

//The controller for the news feed view
function NewsFeedController($scope,$rootScope,NewsFeedFactory) {
	//The array if panelModel objects which represent the model for each panel view
	$scope.panelModels = [];
	//initialise the above variable
	for(var newsFeedIndex=0; newsFeedIndex<$rootScope.newsFeed.length; newsFeedIndex++) {
		$scope.panelModels.push(NewsFeedFactory.generatePanelModel($rootScope.newsFeed[newsFeedIndex]));
	}

	//Generate an actionButton model and add to scope
	$scope.actionButtonModel = NewsFeedFactory.generateActionButtonModel();

	//The listener for when the user changes the value of the panel checkbox
	//panelModelChanged: The panel model object whose checkbox was clicked
	$scope.panelCheckboxChange = function(panelModelChanged) {
		//If the checkbox is true
		if(panelModelChanged.checkbox) {
			//Set the disabled field to false
			$scope.actionButtonModel.setDisabled(false);
		}
		//Otherwise check if any of the checkboxes are true
		else if(NewsFeedFactory.areAnyPanelCheckboxesSet($scope.panelModels)) {
			//Set the disabled field to false
			$scope.actionButtonModel.setDisabled(false);
		}
		//Otherwise none of them are true
		else {
			//Set the disabled to false
			$scope.actionButtonModel.setDisabled(true);
		}
	};

	//The listener for the save all news feed items button
	$scope.saveNewsFeedItemsClickListener = function() {
		NewsFeedFactory.postNewsFeedItems($rootScope.newsFeed,function(status,data) {
			console.log(status);
		});
	};

	//The button for the save selected news feed items
	$scope.saveSelectedNewsFeedItemsClickListener = function() {
		NewsFeedFactory.postNewsFeedItems(NewsFeedFactory.getSelectedNewsFeedItems($scope.panelModels),function(status,data) {
			console.log(status);
		});
	};

	//The click listener for the add new new feed item
	$scope.addNewNewsFeedItemClickListener = function() {
		//Make a new newsFeedItem object
		var newNewsFeedItem = NewsFeedFactory.getNewNewsFeedItem();

		//Add it ot eh master list
		$rootScope.newsFeed.splice(0,0,newNewsFeedItem);

		//Generate a panle model fir it and add it to the panelModels array
		$scope.panelModels.splice(0,0,NewsFeedFactory.generatePanelModel(newNewsFeedItem));
	};
}

angular.module("mymartlet.admin.newsfeed")
	.controller("NewsFeedController",NewsFeedController);

