//Gte the moment library to convert the returned tiomes from Zulu to EST
var moment = require('moment-timezone');

//The transform to apply when converting docs to objects for the admin system
exports.adminTransform = function(doc,ret,options) {
	delete ret._id;
	delete ret.LastUpdatedBy;
	delete ret.AddedBy;
	delete ret.AddedOn;
	delete ret.__v;

	//Check if the ret object is not null
	if(ret) {
		//Set the LastUpdatedOn to an EST string
		ret.LastUpdatedOn = moment(ret.LastUpdatedOn).tz("America/Toronto").format();
	}
};

//The transform to apply when converting docs to objects for the mobile devices
exports.mobileTransform = function(doc,ret,options) {
	delete ret._id;
	delete ret.LastUpdatedBy;
	delete ret.LastUpdatedOn;
	delete ret.AddedBy;
	delete ret.AddedOn;
	delete ret.__v;
};