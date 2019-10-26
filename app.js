const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");

const Config = require("./config/key");

const client = new Commando.Client({
	owner: Config.owner,
});

client.on("ready", () => console.log("Ready"));

client.registry
	.registerGroups([["info", "Info commands"], ["admin", "Admin commands"]])

	.registerDefaults()

	.registerCommandsIn(path.join(__dirname, "commands"));

// Login the bot
client.login(Config.bot_token);
