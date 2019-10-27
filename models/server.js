const mongoose = require("mongoose");

const guildModel = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	ownerID: {
		type: String,
		required: true,
	},
	region: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
	},
	settings: {
		type: mongoose.Schema.Types.ObjectId,
	},
});

const Guild = mongoose.model("Guild", guildModel);
module.exports = Guild;
