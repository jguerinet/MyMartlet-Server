//The settings document which we will use
var settings = null;

//The mongoose setting smodel
var Settings = require("../models/settings");

//Call this function at the beginning when setting suthe serve to ensure tahat we have a settings object
exports.setSettingsObject = function() {
	//Get the settings object from the db
	Settings.findOne({},function(err,settingsFound) {
		//If err throw it since we need the settings object
		if(err) {
			throw err;
		}

		//if no settingsFound then create a new one and set the settings object to that
		if(!settingsFound) {
			settings = new Settings({});

			//Save the new one to the db.
			settings.save(function(err) {
				if(err) {
					throw err;
				}
			});
		}
		//Otherwise simply set setitngs to settingsFound
		else {
			settings = settingsFound;
		}

		//Set the settings vavr to the acquired Settings object
		settings = settings.toObject();
	});
};

//Get the next unique NewsFeedId and updates the id in the settigns var and in the db
exports.getNewsFeedId = function() {
	var newsFeedId = settings.UniqueIds.NewsFeedId;

	settings.UniqueIds.NewsFeedId+=1;
	Settings.updateNewsFeedId();

	return newsFeedId;
};