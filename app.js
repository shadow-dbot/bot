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

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/discord-bot";

mongoose
	.connect("mongodb://localhost:27017/discord-bot", {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(_ => console.log("connected"))
	.catch(e => console.error("error connecting mongodb"));

client.on("ready", () => console.log("Ready"));

client.on("message", async msg => {
	await checkGuild(msg.guild);

	let guilds = await Guilds.findOne({ guildID: msg.guild.id });
	let settings = await Settings.findOne({ guildID: msg.guild.id });

	if (settings.profanity.filter) {
		if (settings.profanity.words.some(word => msg.content.includes(word))) {
			msg.delete();
			msg.reply("You're not allowed to say that word here...");
		}
	}
});

client.on("guildMemberAdd", async member => {
	await checkGuild(msg.guild);

	let guilds = await Guilds.findOne({ guildID: member.guild.id });
	let settings = await Settings.findOne({ guildID: member.guild.id });

	if (settings.welcome.msg) {
		let channelName = "welcome-log";

		if (settings.welcome.channel) channelName = settings.welcome.channel;

		let welcomeChannel = member.guild.channels.find(ch => ch.name == channelName);
		welcomeChannel.send(
			`Welcome ${member}! to ${member.guild.name}\n You're the ${member.guild.memberCount} `
		);
	}
});

client.on("guildCreate", async guild => {
	let guilds = await Guilds.findOne({ guildID: guild.id });
	let settings = await Settings.findOne({ guildID: guild.id });

	if (!guilds && !settings) await checkGuild(guild);
});

async function checkGuild(guild) {
	let guilds = await Guilds.findOne({ guildID: guild.id });
	let settings = await Settings.findOne({ guiildID: guild.id });

	if (guilds && settings) return;

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
}

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
