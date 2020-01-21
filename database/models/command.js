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
	guild: {
		ref: "Guild",
		type: mongoose.Schema.Types.ObjectId,
	},
	time: {
		type: Date,
		default: Date.now(),
	},
});

const Command = mongoose.model("Command", commandModel);
module.exports = Command;
