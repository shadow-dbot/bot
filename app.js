const { Structures } = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");

const Config = require("./config/key");

Structures.extend("Guild", Guild => {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				queue: [],
				isPlaying: false,
				nowPlaying: null,
				songDispatcher: null,
			};
		}
	}
	return MusicGuild;
});

const client = new Commando.Client({
	owner: Config.owner,
});

client.on("ready", () => console.log("Ready"));

client.registry
	.registerGroups([
		["admin", "Admin commands"],
		["fun", "fun commands"],
		["gifs", "Gif commands"],
		["info", "Info commands"],
		["misc", "Misc commands"],
		["music", "Music commands"],
	])

	.registerDefaults()

	.registerCommandsIn(path.join(__dirname, "commands"));

client.login(Config.bot_token);
