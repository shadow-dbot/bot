const path = require("path");

const register = client => {
	client.registry
		.registerGroups([
			["admin", "Admin commands"],
			["fun", "fun commands"],
			["gifs", "Gif commands"],
			["info", "Info commands"],
			["misc", "Misc commands"],
			["music", "Music commands"],
			["creator", "Creator Commands"],
		])

		.registerDefaults()

		.registerCommandsIn(path.join(__dirname, "../commands"));
};

module.exports = client => register(client);
