const timestamps = require("mongoose-timestamps");
const mongoose = require("mongoose");

const suggestionModel = new mongoose.Schema({
	suggestion: {
		type: String,
		required: true,
	},
	author: {
		name: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
	},
});

suggestionModel.plugin(timestamps);

const Suggestion = mongoose.model("Suggestion", suggestionModel);
module.exports = Suggestion;
