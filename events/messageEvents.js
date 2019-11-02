const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

module.exports = {
	index: async (client, guild, msg) => {
		if (msg.author.bot) return;
		if (msg.channel.type === "dm") return;

		// await checkGuild.guild(client, guild);

		let settings = await Settings.findOne({ guildID: guild.id });

		if (settings.profanity.filter) {
			if (settings.profanity.words.some(word => msg.content.includes(word))) {
				msg.delete();
			}
		}
	},
};
