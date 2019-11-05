const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

const db = require("../models");
const checkDB = require("../utils/checkDB");
const Config = require("../config/key");

module.exports = {
	create: async (client, guild) => {
		await checkDB.guild(client, guild);

		console.log(
			`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
		);
	},

	delete: async (client, guild) => {
		console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	},

	memberAdd: async (client, guild, member) => {
		await checkDB.guild(client, guild);

		let settings = await db.Settings.findOne({ guildID: guild.id });

		if (settings.welcome.active) {
			let channelName, welcomeChannel;

			if (settings.welcome.channel) channelName = settings.welcome.channel;

			welcomeChannel = member.guild.channels.find(ch => ch.name == channelName);
			welcomeChannel.send(
				`Welcome ${member}! to ${member.guild.name}\nYou're the ${member.guild.memberCount}th member! `
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
