//The transform to apply when converting docs to objects for the admin system
exports.adminTransform = function(doc,ret,options) {
	delete ret._id;
	delete ret.LastUpdatedBy;
	delete ret.LastUpdatedOn;
	delete ret.AddedBy;
	delete ret.AddedOn;
	delete ret.__v;
};