var mongoose = require("mongoose");

//Th validation methods used for this mongoose model
var placeValidation = require("../validation/place");

var placeSchema = new mongoose.Schema({
	PlaceId: {
		type: Number,
		required: true
	},
	Name: {
		type: String,
		required: true
	},
	Categories: {
		type: [String],
		default: [],
		validate: [{validator: placeValidation.validateCategory,msg: "Invalid category string"}]
	},
	Address: {
		BuildingNumber: {
			type: Number,
			required: true
		},
		Street: {
			type: String,
			required: true
		},
		PostalCode: {
			type: String,
			required: true
		}
	},
	Latitude: {
		type: Number,
		required: true
	},
	Longitude: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("Place",placeSchema);