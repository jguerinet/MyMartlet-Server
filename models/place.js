var mongoose = require("mongoose");

var placeSchema = new mongoose.Schema({
	Name: {
		type: String,
		required: true
	},
	Categories: {
		type: [String],
		default: []
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