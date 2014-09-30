//Validates the category string passed
exports.validateCategory = function(category) {
	//Get the array of string categories that are allowed
	var allowedCategories = require("../constants/place_categories");

	//Convert category to lower case since in the above array the strings are lower case and trim the string
	category = category.toLowerCase().trim();

	//Go through all the allowed categories and check if the current one matches the passendcategory string
	for(var index=0; index<allowedCategories.length; index++) {
		//If it does return true
		if(category == allowedCategories[index]) {
			return true;
		}
	}

	//Otherwise return false we could not find any that matched the string
	return false;
};