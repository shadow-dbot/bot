const { Structures } = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");
const mongoose = require("mongoose");

const Command = require("./models/command");
const Error = require("./models/error");
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

const mongoURI = Config.mongo_uri;

mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
	})
	.then(_ => console.log("connected"))
	.catch(e => console.error(e));

client.on("ready", () => console.log("Ready"));

client.on("message", async msg => {
	if (msg.author.bot) return;
	if (msg.channel.type === "dm") return;

	const guild = msg.guild;

	await checkGuild(guild);

	let foundGuild = await Guilds.findOne({ guildID: guild.id });
	let settings = await Settings.findOne({ guildID: guild.id });

	if (settings.profanity.filter) {
		if (settings.profanity.words.some(word => msg.content.includes(word))) {
			msg.delete();
			// msg.reply("You're not allowed to say that word here...")
		}
	}
});

client.on("guildMemberAdd", async member => {
	const guild = member.guild;
	await checkGuild(guild);

	let foundGuild = await Guilds.findOne({ guildID: guild.id });
	let settings = await Settings.findOne({ guildID: guild.id });

	if (settings.welcome.msg) {
		let channelName = "welcome-log";
		if (settings.welcome.channel) channelName = settings.welcome.channel;
		let welcomeChannel = member.guild.channels.find(ch => ch.name == channelName);
		welcomeChannel.send(
			`Welcome ${member}! to ${member.guild.name}\n You're the ${member.guild.memberCount} `
		);
	}
});

client.on("commandError", (cmd, error, cmdMessage, query) => {
	try {
		const newError = new Error({
			guildID: cmdMessage.channel.guild.id,
			userID: cmdMessage.author.id,
			cmdGroup: cmd.group.id,
			cmdName: cmd.memberName,
			errorMsg: error,
			queryMsg: query.query,
		});

		newError.save();
		client.users.get(Config.owner, false).send("An error occured.");
		console.log("Submitted error");
	} catch (e) {
		console.error(e);
		console.log("Error submitting to db");
	}
});

async function checkGuild(guild) {
	let foundGuild = await Guilds.findOne({ guildID: guild.id });
	let settings = await Settings.findOne({ guildID: guild.id });

	if (foundGuild && settings) return;

	settings = new Settings({ guildID: guild.id });
	settings.save();

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
		["owner", "Commands for the owner of the bot."],
	])

	.registerDefaults()

	.registerCommandsIn(path.join(__dirname, "commands"));

client.login(Config.bot_token);
