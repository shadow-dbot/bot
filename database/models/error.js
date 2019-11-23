const mongoose = require("mongoose");

const errorModel = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	userID: {
		type: String,
		required: true,
	},
	cmdGroup: {
		type: String,
		required: true,
	},
	cmdName: {
		type: String,
		required: true,
	},
	errorMsg: {
		type: String,
		required: true,
		type: String,
	},
	queryMsg: {
		type: String,
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

const Error = mongoose.model("Error", errorModel);
module.exports = Error;
