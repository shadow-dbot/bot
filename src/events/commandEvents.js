const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

const db = require("../database");
const checkDB = require("../utils/checkDB");

module.exports = {
	error: async (client, guild, cmd, error, cmdMessage, query) => {
		const newError = new db.Error({
			guildID: guild.id,
			userID: cmdMessage.author.id,
			cmdGroup: cmd.group.id,
			cmdName: cmd.memberName,
			errorMsg: error,
			queryMsg: query.query,
		});

		newError.save();
		client.users.get(process.env.BOT_OWNER, false).send("An error occured.");
		console.log("An error occured, Saved. ");
	},
	stats: async (client, cmd, guild) => {
		if (guild) {
			const _guild = await db.Guilds.findOne({ guildID: guild.id }).catch(e => {
				console.log(e);
			});
			const newCommand = new db.Command({
				type: cmd.name,
				group_type: cmd.groupID,
				guild: _guild,
			});
			return await newCommand.save();
		}
		const newCommand = new db.Command({
			type: cmd.name,
			group_type: cmd.groupID,
		});
		await newCommand.save();
	},
};
