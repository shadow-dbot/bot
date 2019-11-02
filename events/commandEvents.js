const Discord = require("discord.js");
const Moment = require("moment");
const path = require("path");

const db = require("../models");
const checkDB = require("../utils/checkDB");
const Config = require("../config/key");

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
		client.users.get(Config.owner, false).send("An error occured.");
		console.log("An error occured, Saved. ");
	},
	stats: async (client, cmd) => {
		const newCommand = new db.Command({
			type: cmd.name,
			group_type: cmd.groupID,
		});

		await newCommand.save();
	},
};
