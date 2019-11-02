const mongoose = require("mongoose");
const Config = require("./../config/key.js");

const mongoURI = Config.mongo_uri;

mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
	})
	.then(_ => console.log("connected"))
	.catch(e => console.error(e));

module.exports.Command = require("./command");
module.exports.Error = require("./error");
module.exports.Guilds = require("./server");
module.exports.Settings = require("./settings");
