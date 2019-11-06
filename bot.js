const { Structures } = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");

// const db = require("./models/");
// const checkDB = require("./utils/checkDB");

const messageEvent = require("./events/messageEvents");
const guildEvent = require("./events/guildEvents");
const channelEvent = require("./events/channelEvents");
const commandEvent = require("./events/commandEvents");

const Config = require("./config/key.js");

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
	commandPrefix: Config.prefix,
	owner: Config.owner,
});

client.on("ready", () => console.log("Ready"));

client.on("message", async msg => {
	await messageEvent.index(client, msg.guild, msg);
});

/* Guild Events */
client.on("guildCreate", async guild => {
	await guildEvent.create(client, guild);
});

client.on("guildDelete", async guild => {
	await guildEvent.delete(client, guild);
});

client.on("guildMemberAdd", async member => {
	await guildEvent.memberAdd(client, member.guild, member);
});

client.on("guildUnavailable", async guild => {
	await guildEvent.unAvailable(client, guild);
});

// client.on("guildBanAdd", async (guild, user) => {
// 	await guildEvent.banAdd(client, guild, user);
// });

client.on("commandError", async (cmd, error, cmdMessage, query) => {
	await commandEvent.error(client, cmdMessage.channel.guild, cmd, error, cmdMessage, query);
});

client.on("commandRun", async cmd => {
	await commandEvent.stats(client, cmd);
});

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
