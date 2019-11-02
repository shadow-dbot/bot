const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

const db = require("../models");
const checkDB = require("../utils/checkDB");
const Config = require("../config/key");

module.exports = {
	index: async (client, guild, msg) => {
		if (msg.author.bot) return;
		if (msg.channel.type === "dm") return;

		await checkDB.guild(client, guild);

		let settings = await db.Settings.findOne({ guildID: guild.id });

		if (settings.profanity.filter) {
			if (settings.profanity.words.some(word => msg.content.includes(word))) {
				msg.delete();
			}
		}
	},
};
