const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(_ => console.log("connected"))
	.catch(e => console.error(e));

module.exports = {
	Command: require("./models/command"),
	Error: require("./models/error"),
	Guilds: require("./models/server"),
	Settings: require("./models/settings"),
	Suggestion: require("./models/suggestion"),
};
