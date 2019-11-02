const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

const db = require("../models");
const checkDB = require("../utils/checkDB");

module.exports = {
	create: async (client, guild) => {
		await checkDB.guild(client, guild);

		console.log(
			`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
		);

		guild.channels
			.find(`name`, `general`)
			.send(
				`Thanks for inviting me! This bot is in BETA If you encounter any error please let us know.`
			);
	},

	delete: async (client, guild) => {
		console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
		// client.user.setActivity(`Serving ${client.guilds.size} servers`);
	},

	memberAdd: async (client, guild, member) => {
		await checkDB.guild(client, guild);

		let settings = await Settings.findOne({ guildID: guild.id });

		if (settings.welcome.msg) {
			let channelName = "welcome-log";
			if (settings.welcome.channel) channelName = settings.welcome.channel;
			let welcomeChannel = member.guild.channels.find(ch => ch.name == channelName);
			welcomeChannel.send(
				`Welcome ${member}! to ${member.guild.name}\n You're the ${member.guild.memberCount} `
			);
		}
	},

	unAvailable: async (client, guild) => {
		console.error(`a guild becomes unavailable, likely due to a server outage: ${guild}`);
	},

	banAdd: async (client, guild, user) => {
		await channels.guildChannel(client, guild);

		let guildLogChannel = guild.channels.find(chan => chan.name == "guild-log");

		const embed = new Discord.RichEmbed()
			.setColor("#ff0000")
			.setAuthor(`${user.tag}`, `${user.avatarURL}`)
			.addField("Banned User", `${user.tag}`, true)
			.setTimestamp()
			.setFooter(`${client.user.tag}`);
		guildLogChannel.send(embed);
	},
};
