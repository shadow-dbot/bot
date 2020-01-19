const mongoose = require("mongoose");

const analyticsModel = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
});

const Analytics = mongoose.model("Analytics", analyticsModel);
module.exports = Command;
