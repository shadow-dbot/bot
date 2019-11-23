const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

const db = require("../../database");
const checkDB = require("../../utils/checkDB");

module.exports = {
	index: async (client, guild, msg) => {
		if (msg.author.bot) return;
		if (msg.channel.type === "dm") return;

		await checkDB.guild(client, guild);

		let settings = await db.Settings.findOne({ guildID: guild.id });

		if (settings.filter.active) {
			if (settings.filter.words.some(word => msg.content.includes(word))) {
				msg.delete();
			}
		}
	},
};
