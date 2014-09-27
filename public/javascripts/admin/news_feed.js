angular.module("mymartlet.admin.newsfeed",[])
	.constant("NewsFeedConstants",{
		saveNewsFeedUrl: "/admin/api/save_news_feed",
		deleteNewsFeedUrl: "/admin/api/delete_news_feed"
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

	//Generate a model for the search view
	newsFeedFactory.generateSearchModel = function() {
		return {
			//The text the user has entered into the search input
			searchText: "",

			//The property by which the user is filtering the new feed items
			searchProperty: "Title",
			//Setter for the searchProperty field. Also sets the searchDisplay var
			setSearchProperty: function(property) {
				this.searchProperty = property;

				switch(property) {
					case "Title": {
						this.searchDisplay = "Title";
						break;
					}
					case "NewsFeedId": {
						this.searchDisplay = "News Feed Id";
						break;
					}
				}
			},

			//The text that informs the user what he is currently filtering by
			searchDisplay: "Title"
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

	//General method to make post requests
	newsFeedFactory.makePost = function(postUrl,postBody,callback) {
		$http.post(postUrl,postBody)
			.success(function() {
				callback(null);
			})
			.error(function(response,data,status,headers) {
				callback(data,response);
			});
	};

	//Removes a newsFeeDItemObject from the passed panelModels and the master list
	//if it has the same NewsFeedId as the passed var
	newsFeedFactory.removeModelWithNewsFeedId = function(newsFeedId,panelModels) {
		//Find the object to delete from the passed panelModels array
		for(var index=0; index<panelModels.length; index++) {
			if(panelModels[index].dataModel.NewsFeedId == newsFeedId) {
				panelModels.splice(index,1);
				break;
			}
		}

		//Find the object to delete from the master list
		for(var index=0; index<$rootScope.newsFeed.length; index++) {
			if($rootScope.newsFeed[index].NewsFeedId == newsFeedId) {
				$rootScope.newsFeed.splice(index,1);
				break;
			}
		}
	};

	return newsFeedFactory;
}

angular.module("mymartlet.admin.newsfeed")
	.factory("NewsFeedFactory",NewsFeedFactory);

//The controller for the news feed view
function NewsFeedController($scope,$rootScope,NewsFeedFactory,NewsFeedConstants) {
	//The array if panelModel objects which represent the model for each panel view
	$scope.panelModels = [];
	//initialise the above variable
	for(var newsFeedIndex=0; newsFeedIndex<$rootScope.newsFeed.length; newsFeedIndex++) {
		$scope.panelModels.push(NewsFeedFactory.generatePanelModel($rootScope.newsFeed[newsFeedIndex]));
	}

	//Generate an actionButton model and add to scope
	$scope.actionButtonModel = NewsFeedFactory.generateActionButtonModel();

	$scope.searchModel = NewsFeedFactory.generateSearchModel();

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

	//The click listener for the add new new feed item
	$scope.addNewNewsFeedItemClickListener = function() {
		//Make a new newsFeedItem object
		var newNewsFeedItem = NewsFeedFactory.getNewNewsFeedItem();

		//Add it ot eh master list
		$rootScope.newsFeed.splice(0,0,newNewsFeedItem);

		//Generate a panle model fir it and add it to the panelModels array
		$scope.panelModels.splice(0,0,NewsFeedFactory.generatePanelModel(newNewsFeedItem));
	};


	//The button for the save selected news feed items
	$scope.saveSelectedNewsFeedItemsClickListener = function() {
		NewsFeedFactory.makePost(NewsFeedConstants.saveNewsFeedUrl,{newsFeedItems:NewsFeedFactory.getSelectedNewsFeedItems($scope.panelModels)},function(status,data) {
			console.log(status);
		});
	};

	//The click listener for the button that deletes selected news feed items
	$scope.deleteSelectedNewsFeedItemsClickListener = function() {
		//Get all the selected news feed items
		var selectedNewsFeedItems = NewsFeedFactory.getSelectedNewsFeedItems($scope.panelModels);

		//Make the post to delete the selectes new feed items.
		NewsFeedFactory.makePost(NewsFeedConstants.deleteNewsFeedUrl,{newsFeedItems:selectedNewsFeedItems},function(status,data) {
			//Inside the callback
			//If data is null then it was sucessfully
			if(!data) {
				//Go through the selected news feed items and remove them from the panelModel array and master list
				for(var index=0; index<selectedNewsFeedItems.length; index++) {
					NewsFeedFactory.removeModelWithNewsFeedId(selectedNewsFeedItems[index].NewsFeedId,$scope.panelModels);
				}
			}
		});
	};
}

angular.module("mymartlet.admin.newsfeed")
	.controller("NewsFeedController",NewsFeedController);

//The filter to decide what news feed items to show to the user depending on the value of the search text they type in
//searchProperty: The property by which the user wants to filter the items by
//searchText: The search items entered
function NewsFeedItemsFilter() {
	return function(panelModelItems,searchProperty,searchText) {
		//The array that has all our search results
		var searchResults = [];

		//Go through the panelModelItems
		for(var index=0; index<panelModelItems.length; index++) {
			//Convert the property value to a string and check if the text entered is present int ehs tring
			if((panelModelItems[index].dataModel[searchProperty] + "").indexOf(searchText) > -1) {
				//if it si then oush the object to the searchResults array
				searchResults.push(panelModelItems[index]);
			}
		}

		//Return the searchResults
		return searchResults;
	}
}

angular.module("mymartlet.admin.newsfeed")
	.filter("newsFeedFilter",NewsFeedItemsFilter);

