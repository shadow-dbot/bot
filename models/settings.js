const mongoose = require("mongoose");

const badwords = require("../utils/badwords.js");

const settingsModel = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	welcome: {
		active: {
			type: Boolean,
			default: false,
		},
		msg: {
			type: String,
			default: "Welcome to this server ${user}",
		},
		channel: {
			type: String,
			default: "general",
		},
	},
	filter: {
		active: {
			type: Boolean,
			default: false,
		},
		words: {
			type: Array,
			default: badwords,
		},
	},
});

const Settings = mongoose.model("Settings", settingsModel);
module.exports = Settings;
