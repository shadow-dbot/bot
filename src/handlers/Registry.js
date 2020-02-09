const path = require("path");

const register = client => {
	client.registry
		.registerGroups([
			["admin", "Admin commands"],
			["info", "Info commands"],
			["fun", "fun commands"],
			["gifs", "Gif commands"],
			["misc", "Misc commands"],
			["music", "Music commands"],
			["creator", "Creator Commands"],
		])

		.registerDefaults()

		.registerCommandsIn(path.join(__dirname, "../commands"));
};

module.exports = client => register(client);
