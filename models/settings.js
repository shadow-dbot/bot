const mongoose = require("mongoose");

const settingsModel = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	welcome: {
		msg: {
			type: Boolean,
			default: false,
		},
		channel: {
			type: String,
			default: "general",
		},
	},
	profanity: {
		filter: {
			type: Boolean,
			default: false,
		},
		words: {
			type: Array,
			default: ["fuck"],
		},
	},
});

const Settings = mongoose.model("Settings", settingsModel);
module.exports = Settings;
