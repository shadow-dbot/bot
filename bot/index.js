const { Structures } = require("discord.js");

const Commando = require("discord.js-commando");
const Handlers = require("./handlers/");

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
	commandPrefix: process.env.PREFIX,
	owner: process.env.BOT_OWNER,
});

Handlers(client);

client.login(process.env.BOT_TOKEN);
