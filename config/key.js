!process.env.NODE_ENV || process.env.NODE_ENV === "development"
	? (module.exports = require("./dev.js"))
	: (module.exports = require("./prod.js"));
