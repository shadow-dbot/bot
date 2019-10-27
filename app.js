const { Structures } = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");
const mongoose = require("mongoose");

const Command = require("./models/command");
const Guilds = require("./models/server");
const Settings = require("./models/settings");

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

mongoose
	.connect("mongodb://localhost:27017/discord-bot", {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(_ => console.log("connected"))
	.catch(e => console.error("error connecting mongodb"));

client.on("ready", () => console.log("Ready"));

client.on("guildCreate", async guild => {
	let guilds = await Guilds.findOne({ guildID: guild.id });
	let settings = await Settings.findOne({ guiildID: guild.id });
	if (!guilds) console.log(guilds);

	if (!settings) {
		settings = new Settings({ guildID: guild.id });
		settings.save();
	}

	const newServer = new Guilds({
		guildID: guild.id,
		ownerID: guild.ownerID,
		region: guild.region,
		name: guild.name,
		icon: guild.icon,
		settings: settings._id,
	});
	await newServer.save();
});

client.on("commandRun", async cmd => {
	const newCommand = new Command({
		type: cmd.name,
		group_type: cmd.groupID,
	});
	await newCommand.save();
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
