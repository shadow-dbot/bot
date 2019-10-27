const mongoose = require("mongoose");

const commandModel = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	group_type: {
		type: String,
		required: true,
	},
	time: {
		type: Date,
		default: Date.now(),
	},
});

const Command = mongoose.model("Command", commandModel);
module.exports = Command;
