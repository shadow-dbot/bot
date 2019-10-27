const mongoose = require("mongoose");

const settingsModel = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
});

const Settings = mongoose.model("Settings", settingsModel);
module.exports = Settings;
